-- Add SEO fields to blogs
alter table blogs add column if not exists seo_title text;
alter table blogs add column if not exists seo_description text;
alter table blogs add column if not exists seo_image_alt text;

-- Add SEO fields to plants
alter table plants add column if not exists seo_title text;
alter table plants add column if not exists seo_description text;
alter table plants add column if not exists seo_image_alt text;
