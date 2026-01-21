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
    position: 'Chief Executive Officer',
    bio: 'Visionary leader with extensive experience in renewable energy and business development. Driving Feraj Solar Limited towards sustainable energy solutions across Africa.',
    imageUrl: '/images/team/joshua-orwa.jpeg',
    linkedin: '#',
  },
  {
    id: '2',
    name: 'Mr Jerry Onyango',
    position: 'Director',
    bio: 'Strategic director with deep expertise in solar technology implementation and project management. Committed to expanding solar accessibility across Kenya.',
    imageUrl: '/images/team/jerry-onyango.jpeg',
    linkedin: '#',
  },
  {
    id: '3',
    name: 'Mr Max Feng',
    position: 'Director',
    bio: 'International business director specializing in technology partnerships and market expansion. Bringing global solar innovations to local markets.',
    imageUrl: '/images/team/max-feng.jpeg',
    linkedin: '#',
  },
  {
    id: '4',
    name: 'Mr Bonkee Omwai',
    position: 'Director of Operations',
    bio: 'Operations expert focused on optimizing solar installation processes and ensuring quality service delivery across all Feraj Solar Limited projects.',
    imageUrl: '/images/team/bonkee-omwai.jpeg',
    linkedin: '#',
  },
];
