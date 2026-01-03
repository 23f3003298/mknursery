import { Helmet } from 'react-helmet-async'

export default function SeoHelmet({
  title,
  description,
  canonical,
  robots = 'index,follow',
  image,
  children
}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {robots && <meta name="robots" content={robots} />}
      {image && <meta property="og:image" content={image} />}
      {children}
    </Helmet>
  )
}
