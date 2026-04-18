import { motion } from 'framer-motion';

interface TiltCardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly glowColor?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(160, 0, 181, 0.4)',
}) => {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 30px 4px ${glowColor}`,
        borderColor: 'rgba(160, 0, 181, 0.4)',
      }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
