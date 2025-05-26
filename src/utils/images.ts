import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';

interface ImageModule {
  default: ImageMetadata;
}

interface ImageRecord {
  [key: string]: () => Promise<ImageModule>;
}

const load = async function (): Promise<ImageRecord | undefined> {
  let images: ImageRecord | undefined = undefined;
  try {
    images = import.meta.glob<ImageModule>('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch (e) {
    // continue regardless of error
  }
  return images;
};

let _images: ImageRecord | undefined = undefined;

/** */
export const fetchLocalImages = async (): Promise<ImageRecord | undefined> => {
  _images = _images || (await load());
  return _images;
};

/** */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Not string
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Absolute paths
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  // Relative paths or not "~/assets/"
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as ImageModule).default
    : null;
};

interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
}

/** */
export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<OpenGraph> => {
  if (!openGraph?.images?.length) {
    return openGraph;
  }

  const images = openGraph.images;
  const defaultWidth = 1200;
  const defaultHeight = 626;

  const adaptedImages = await Promise.all(
    images.map(async (image): Promise<OpenGraphImage> => {
      if (image?.url) {
        const resolvedImage = (await findImage(image.url)) as ImageMetadata | undefined;
        if (!resolvedImage) {
          return {
            url: '',
          };
        }

        const _image = await getImage({
          src: resolvedImage,
          alt: 'Placeholder alt',
          width: image.width || defaultWidth,
          height: image.height || defaultHeight,
        });

        if (typeof _image === 'object') {
          const width = 'width' in _image && typeof _image.width === 'number' ? _image.width : undefined;
          const height = 'height' in _image && typeof _image.height === 'number' ? _image.height : undefined;
          return {
            url: typeof _image.src === 'string' ? String(new URL(_image.src, astroSite)) : 'pepe',
            width,
            height,
          };
        }
        return {
          url: '',
        };
      }

      return {
        url: '',
      };
    })
  );

  return { ...openGraph, ...(adaptedImages ? { images: adaptedImages } : {}) };
};
