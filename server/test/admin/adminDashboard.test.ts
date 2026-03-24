import fs from 'node:fs';
import path from 'node:path';

describe('AdminDashboard', () => {
  test('wraps and returns SuperAdminDashboard', () => {
    const filePath = path.resolve(
      __dirname,
      '../../src/components/adminDashboard.tsx'
    );
    const source = fs.readFileSync(filePath, 'utf8');

    expect(source).toContain(
      'import { SuperAdminDashboard } from "@/components/admin-dashboard";'
    );
    expect(source).toContain('return <SuperAdminDashboard />;');
  });
});
