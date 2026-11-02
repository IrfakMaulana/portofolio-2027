export interface ProjectItem {
  id: string;
  src: string;
  title: string;
  description: string;
  tag: string;
  demoUrl?: string;
}

export interface AboutCard {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  github?: string;
}

export interface SiteConfig {
  theme: {
    primaryColor: string;
    bgMedia: {
      type: "video" | "image";
      customUrl: string;
    };
  };
  nav: {
    brandName: string;
    homeLabel: string;
    galleryLabel: string;
    aboutLabel: string;
    contactLabel: string;
  };
  footer: {
    copyrightText: string;
    designerName: string;
    designerUrl: string;
  };
  home: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    buttonText: string;
    resumeUrl: string;
    certificateUrl?: string;
    img1: string;
    img2: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    items: ProjectItem[];
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    cards: AboutCard[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    tel?: string;
    location?: string;
    mapQuery?: string;
    formspreeUrl: string;
    socials?: SocialLinks;
  };
}
