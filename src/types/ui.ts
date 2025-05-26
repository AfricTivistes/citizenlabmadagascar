export interface CallToAction {
  text?: string;
  href?: string;
  icon?: string;
}

export interface ItemGrid {
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    callToAction?: CallToAction;
  }>;
  columns?: number;
  defaultIcon?: string;
}

export interface Collapse {
  icon?: string;
  title?: string;
  content?: string;
}

export interface Form {
  inputs?: Array<{
    type?: string;
    name?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
  }>;
  submitLabel?: string;
  privacyLabel?: string;
  successMessage?: string;
}

export interface Image {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Video {
  link?: string;
  aspectRatio?: string;
  poster?: Image;
}

export interface Testimonial {
  content?: string;
  author?: {
    name?: string;
    role?: string;
    image?: Image;
  };
}

export interface Timeline {
  title?: string;
  items?: Array<{
    title?: string;
    content?: string;
    date?: string;
    icon?: string;
  }>;
}

export interface Team {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    subtitle?: string;
    description?: string;
    image?: Image;
    social?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  }>;
}

export interface Stats {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    value?: string;
    description?: string;
  }>;
}

export interface Hero {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: Image;
  callToAction?: CallToAction;
  callToAction2?: CallToAction;
}

export interface Features {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    callToAction?: CallToAction;
  }>;
}

export interface Features2 {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: Image;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
  }>;
}

export interface Features3 {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
  }>;
}

export interface Content {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
  }>;
}

export interface Steps {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
  }>;
}

export interface Steps2 {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: Image;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
  }>;
}

export interface Social {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    href?: string;
  }>;
}

export interface Faq {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    title?: string;
    description?: string;
  }>;
}

export interface Cta {
  title?: string;
  subtitle?: string;
  description?: string;
  buttons?: Array<CallToAction>;
  image?: Image;
}

export interface Pricing {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<{
    name?: string;
    price?: number;
    description?: string;
    features?: Array<string>;
    callToAction?: CallToAction;
    hasRibbon?: boolean;
    ribbonTitle?: string;
  }>;
}

export interface Testimonials {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: Array<Testimonial>;
}

export interface Comparison {
  title?: string;
  subtitle?: string;
  description?: string;
  columns?: Array<{
    title?: string;
    items?: Array<{
      title?: string;
      tier?: number;
    }>;
  }>;
}

export interface SocialProof {
  title?: string;
  subtitle?: string;
  description?: string;
  images?: Array<Image>;
}

export interface Contact {
  title?: string;
  subtitle?: string;
  description?: string;
  form?: Form;
} 