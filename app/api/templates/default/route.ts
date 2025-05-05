import { NextResponse } from 'next/server';
import { distributeTemplates } from '@/features/templates/services/user-templates';

// GET handler to check template status
export async function GET() {
  return NextResponse.json({ status: 'Template distribution available' });
}

// POST handler to distribute templates to all users
export async function POST(request: Request) {
  try {
    // Optional: Extract template ID from request body
    const body = await request.json().catch(() => ({}));
    const templateId = body.templateId;

    // Use your existing distributeTemplates function
    const result = await distributeTemplates(templateId);

    return NextResponse.json({
      success: true,
      message: 'Template distribution started',
      result,
    });
  } catch (error) {
    console.error('Error distributing templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to distribute templates' },
      { status: 500 }
    );
  }
}
