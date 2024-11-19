import { motion } from "framer-motion";

export default function AdsCard({ Icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: -100, y: -100 }}
      animate={{ opacity: 1, scale: 1, x: 1 }}
      whileInView={{ opacity: [0.2, 0.4, 0.6, 1], scale: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full h-auto p-3 bg-red-100 rounded-lg"
    >
      <div className="flex flex-row items-center gap-2">
        <div>
          <Icon
            size={30}
            className="p-1 overflow-hidden text-white bg-red-500 rounded-full"
          />
        </div>
        <span className="text-lg font-semibold text-neutral-700">{title}</span>
      </div>
      <p className="pb-5 mt-2 text-sm text-neutral-500">{description}</p>
    </motion.div>
  );
}
