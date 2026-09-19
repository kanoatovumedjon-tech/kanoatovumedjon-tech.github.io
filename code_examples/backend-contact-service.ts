// ============================================
// Contact Service - Backend Example
// TypeScript + Node.js + Express + PostgreSQL
// ============================================

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// ============================================
// MIDDLEWARE
// ============================================

interface AuthRequest extends Request {
  user?: {
    id: string;
    organization_id: string;
    role: string;
  };
}

const authenticateToken = (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: Function) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// ============================================
// DATABASE SERVICE
// ============================================

class ContactService {
  constructor(private pool: Pool) {}

  async createContact(organizationId: string, contactData: any): Promise<any> {
    const contactId = uuidv4();
    const query = `
      INSERT INTO contacts
      (id, organization_id, first_name, last_name, email, phone, position,
       company_id, owner_id, created_by, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      contactId,
      organizationId,
      contactData.firstName,
      contactData.lastName,
      contactData.email,
      contactData.phone,
      contactData.position,
      contactData.companyId,
      contactData.ownerId,
      contactData.createdBy,
      'active'
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getContact(contactId: string, organizationId: string): Promise<any> {
    const query = `
      SELECT c.*, company.name as company_name
      FROM contacts c
      LEFT JOIN companies company ON c.company_id = company.id
      WHERE c.id = $1 AND c.organization_id = $2 AND c.deleted_at IS NULL;
    `;

    const result = await this.pool.query(query, [contactId, organizationId]);

    if (result.rows.length === 0) {
      throw new Error('Contact not found');
    }

    const contact = result.rows[0];

    // Get tags
    const tagsQuery = `SELECT tag FROM contact_tags WHERE contact_id = $1;`;
    const tagsResult = await this.pool.query(tagsQuery, [contactId]);
    contact.tags = tagsResult.rows.map(row => row.tag);

    // Get activities
    const activitiesQuery = `
      SELECT id, activity_type, subject, start_time, created_at
      FROM activities
      WHERE contact_id = $1
      ORDER BY created_at DESC
      LIMIT 10;
    `;
    const activitiesResult = await this.pool.query(activitiesQuery, [contactId]);
    contact.recentActivities = activitiesResult.rows;

    return contact;
  }

  async listContacts(
    organizationId: string,
    options: {
      limit?: number;
      offset?: number;
      search?: string;
      ownerId?: string;
      status?: string;
    } = {}
  ): Promise<{ data: any[]; total: number }> {
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    let query = `
      SELECT c.*, company.name as company_name
      FROM contacts c
      LEFT JOIN companies company ON c.company_id = company.id
      WHERE c.organization_id = $1 AND c.deleted_at IS NULL
    `;

    const params: any[] = [organizationId];
    let paramIndex = 2;

    if (options.search) {
      query += ` AND (c.first_name ILIKE $${paramIndex}
                    OR c.last_name ILIKE $${paramIndex}
                    OR c.email ILIKE $${paramIndex})`;
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    if (options.ownerId) {
      query += ` AND c.owner_id = $${paramIndex}`;
      params.push(options.ownerId);
      paramIndex++;
    }

    if (options.status) {
      query += ` AND c.status = $${paramIndex}`;
      params.push(options.status);
      paramIndex++;
    }

    // Get total count
    const countQuery = query.replace('SELECT c.*,', 'SELECT COUNT(*)').split('LIMIT')[0];
    const countResult = await this.pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await this.pool.query(query, params);
    return { data: result.rows, total };
  }

  async updateContact(
    contactId: string,
    organizationId: string,
    updates: any
  ): Promise<any> {
    const allowedFields = [
      'first_name', 'last_name', 'email', 'phone', 'position',
      'department', 'company_id', 'owner_id', 'status', 'notes'
    ];

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(contactId, organizationId);

    const query = `
      UPDATE contacts
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1} AND deleted_at IS NULL
      RETURNING *;
    `;

    const result = await this.pool.query(query, params);

    if (result.rows.length === 0) {
      throw new Error('Contact not found');
    }

    return result.rows[0];
  }

  async deleteContact(contactId: string, organizationId: string): Promise<void> {
    const query = `
      UPDATE contacts
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND organization_id = $2;
    `;

    await this.pool.query(query, [contactId, organizationId]);
  }

  async addTag(
    contactId: string,
    tag: string,
    organizationId: string
  ): Promise<void> {
    // Verify contact exists
    const verifyQuery = `
      SELECT id FROM contacts
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const verifyResult = await this.pool.query(verifyQuery, [contactId, organizationId]);

    if (verifyResult.rows.length === 0) {
      throw new Error('Contact not found');
    }

    const tagId = uuidv4();
    const query = `
      INSERT INTO contact_tags (id, contact_id, tag)
      VALUES ($1, $2, $3)
      ON CONFLICT (contact_id, tag) DO NOTHING;
    `;

    await this.pool.query(query, [tagId, contactId, tag]);
  }

  async removeTag(
    contactId: string,
    tag: string,
    organizationId: string
  ): Promise<void> {
    const query = `
      DELETE FROM contact_tags
      WHERE contact_id = $1 AND tag = $2
      AND contact_id IN (
        SELECT id FROM contacts WHERE organization_id = $3 AND deleted_at IS NULL
      );
    `;

    await this.pool.query(query, [contactId, tag, organizationId]);
  }

  async mergeContacts(
    primaryId: string,
    secondaryId: string,
    organizationId: string
  ): Promise<any> {
    try {
      // Verify both contacts exist
      const verifyQuery = `
        SELECT id FROM contacts
        WHERE id = ANY($1) AND organization_id = $2 AND deleted_at IS NULL;
      `;
      const verifyResult = await this.pool.query(verifyQuery, [
        [primaryId, secondaryId],
        organizationId
      ]);

      if (verifyResult.rows.length !== 2) {
        throw new Error('One or both contacts not found');
      }

      // Start transaction
      await this.pool.query('BEGIN');

      // Merge activities
      const activitiesQuery = `
        UPDATE activities
        SET contact_id = $1
        WHERE contact_id = $2 AND organization_id = $3;
      `;
      await this.pool.query(activitiesQuery, [primaryId, secondaryId, organizationId]);

      // Merge deals
      const dealsQuery = `
        UPDATE deals
        SET contact_id = $1
        WHERE contact_id = $2 AND organization_id = $3;
      `;
      await this.pool.query(dealsQuery, [primaryId, secondaryId, organizationId]);

      // Merge tags
      const tagsQuery = `
        INSERT INTO contact_tags (id, contact_id, tag)
        SELECT uuid_generate_v4(), $1, tag FROM contact_tags
        WHERE contact_id = $2
        ON CONFLICT (contact_id, tag) DO NOTHING;
      `;
      await this.pool.query(tagsQuery, [primaryId, secondaryId]);

      // Mark secondary as duplicate
      const duplicateQuery = `
        UPDATE contacts
        SET is_duplicate = true, original_contact_id = $1, deleted_at = CURRENT_TIMESTAMP
        WHERE id = $2;
      `;
      await this.pool.query(duplicateQuery, [primaryId, secondaryId]);

      // Commit transaction
      await this.pool.query('COMMIT');

      return this.getContact(primaryId, organizationId);
    } catch (error) {
      await this.pool.query('ROLLBACK');
      throw error;
    }
  }
}

// ============================================
// ROUTES
// ============================================

export function createContactRoutes(pool: Pool): Router {
  const router = Router();
  const service = new ContactService(pool);

  // Create contact
  router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const contact = await service.createContact(req.user.organization_id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        position: req.body.position,
        companyId: req.body.companyId,
        ownerId: req.body.ownerId || req.user.id,
        createdBy: req.user.id
      });

      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get contacts list
  router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { limit, offset, search, ownerId, status } = req.query;

      const result = await service.listContacts(req.user.organization_id, {
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
        search: search as string,
        ownerId: ownerId as string,
        status: status as string
      });

      res.json({
        data: result.data,
        pagination: {
          total: result.total,
          limit: limit || 50,
          offset: offset || 0
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single contact
  router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const contact = await service.getContact(req.params.id, req.user.organization_id);
      res.json(contact);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  // Update contact
  router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const contact = await service.updateContact(
        req.params.id,
        req.user.organization_id,
        req.body
      );

      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete contact
  router.delete('/:id', authenticateToken, authorizeRole(['admin', 'manager']),
    async (req: AuthRequest, res: Response) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        await service.deleteContact(req.params.id, req.user.organization_id);
        res.status(204).send();
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Add tag to contact
  router.post('/:id/tags', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await service.addTag(req.params.id, req.body.tag, req.user.organization_id);
      res.status(201).json({ message: 'Tag added' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Remove tag from contact
  router.delete('/:id/tags/:tag', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await service.removeTag(req.params.id, req.params.tag, req.user.organization_id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Merge contacts
  router.post('/:id/merge', authenticateToken, authorizeRole(['admin', 'manager']),
    async (req: AuthRequest, res: Response) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const merged = await service.mergeContacts(
          req.params.id,
          req.body.secondaryContactId,
          req.user.organization_id
        );

        res.json({ message: 'Contacts merged', contact: merged });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  return router;
}

export default ContactService;
