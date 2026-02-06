export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  linkedin?: string;
}

export const directors: TeamMember[] = [
  {
    id: '1',
    name: 'Mr Joshua Orwa',
    position: 'Chief Executive Officer (CEO)',
    bio: 'Visionary leader with extensive experience in renewable energy and business development. Driving Feraj Solar Limited towards sustainable energy solutions across Africa.',
    imageUrl: '/images/team/joshua-orwa.jpeg',
    linkedin: '#',
  },
  {
    id: '2',
    name: 'Mr Jerry Onyango',
    position: 'Director of Strategy & Operations',
    bio: 'Strategic director with deep expertise in solar technology implementation and project management. Committed to expanding solar accessibility across Kenya.',
    imageUrl: '/images/team/jerry-onyango.jpeg',
    linkedin: '#',
  },
  {
    id: '3',
    name: 'Mr Max Feng',
    position: 'Director of Global Partnerships',
    bio: 'International business director specializing in technology partnerships and market expansion. Bringing global solar innovations to local markets.',
    imageUrl: '/images/team/max-feng.jpeg',
    linkedin: '#',
  },
];
