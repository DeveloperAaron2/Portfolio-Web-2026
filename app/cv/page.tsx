"use client";

import { motion } from "framer-motion";

export default function DownloadCVPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5, ease: "easeOut" }}
        >
          Download CV as PDF
        </motion.h1>

        <motion.p
          className="mt-4 text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        >
          Download my CV in PDF format.
        </motion.p>

        <motion.a
          href="/cv/CV_Aarón_2026.pdf"
          download
          className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Download PDF
        </motion.a>

        {/* Detalle opcional: “glow” suave detrás */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none mx-auto mt-10 h-20 w-56 rounded-full bg-white/10 blur-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
        />
      </motion.div>
    </section>
  );
}
