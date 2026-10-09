export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Manager' | 'Staff' | 'Guest Relations';
  status: 'active' | 'inactive';
  department: string;
  lastLogin?: string;
  avatar?: string;
}

export interface UserFilter {
  search?: string;
  role?: string;
  department?: string;
}
