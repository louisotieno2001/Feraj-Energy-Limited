-- Make your account an admin

-- Update your account to admin role
UPDATE profiles SET role = 'admin' WHERE email = 'jerryrawlings263@gmail.com';

-- Verify it worked:
SELECT id, email, role FROM profiles WHERE email = 'jerryrawlings263@gmail.com';
