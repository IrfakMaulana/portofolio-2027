import { SiteConfig } from "./types";

export const defaultConfig: SiteConfig = {
  theme: {
    primaryColor: "#99ff66",
    bgMedia: {
      type: "video",
      customUrl: "",
    },
  },
  nav: {
    brandName: "",
    homeLabel: "",
    galleryLabel: "",
    aboutLabel: "",
    contactLabel: "",
  },
  footer: {
    copyrightText: "",
    designerName: "TemplateMo",
    designerUrl: "https://templatemo.com",
  },
  home: {
    title: "",
    paragraph1: "",
    paragraph2: "",
    buttonText: "",
    resumeUrl: "",
    certificateUrl: "",
    img1: "",
    img2: "",
  },
  gallery: {
    title: "",
    subtitle: "",
    items: [],
  },
  about: {
    title: "",
    paragraph1: "",
    paragraph2: "",
    cards: [],
  },
  contact: {
    title: "",
    description: "",
    email: "",
    tel: "",
    location: "",
    mapQuery: "",
    formspreeUrl: "",
    socials: {
      linkedin: "",
      instagram: "",
      twitter: "",
      github: "",
    },
  },
};

