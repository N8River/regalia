import { motion } from "framer-motion";

function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex w-64 shrink-0 flex-col items-center lg:w-auto"
    >
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl lg:h-auto lg:w-auto">
        <motion.div
          animate={{
            background: [
              "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)",
              "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)",
              "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)",
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-full w-full"
        />
      </div>
      <div className="flex w-full flex-col items-start space-y-2 pt-1.5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="flex w-full items-center gap-2.5">
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-8 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCardSkeleton;
