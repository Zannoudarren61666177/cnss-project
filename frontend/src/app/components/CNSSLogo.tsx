import logoImage from '../../imports/cnsslogo.png';

interface CNSSLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function CNSSLogo({ size = 'medium', className = '' }: CNSSLogoProps) {
  const sizes = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16',
  };

  return (
    <img
      src={logoImage}
      alt="CNSS Bénin"
      className={`${sizes[size]} object-contain block mx-auto ${className}`}
    />
  );
}
