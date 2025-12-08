import Link from "next/link";

export const metadata = {
  title: "Learn English with TV – Spanishtvshows.com",
  description:
    "Use TV shows, subtitles, and simple routines to learn real English, not textbook English.",
};

export default function LearnEnglishPage() {
  return (
    <div className="bg-dark min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-xs font-mono tracking-[0.25em] uppercase text-neon mb-4">
          PARA HISPANOHABLANTES
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Aprende inglés viendo series, no solo en apps.
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10">
          Usa Netflix, YouTube y unas pocas herramientas para pasar de
          “I understand a little” a conversaciones reales en 6–12 meses.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="bg-black/80 border border-gray-800 rounded-xl p-6 box-glow">
            <h2 className="text-sm font-mono text-gray-400 tracking-[0.25em] uppercase mb-2">
              1. INPUT
            </h2>
            <h3 className="text-lg font-bold mb-2">Series en inglés con subtítulos</h3>
            <p className="text-sm text-gray-300">
              Elige 1–2 series (*Friends, Suits, The Office*). Primero con
              subtítulos en español, luego en inglés.
            </p>
          </div>
          <div className="bg-black/80 border border-gray-800 rounded-xl p-6 box-glow">
            <h2 className="text-sm font-mono text-gray-400 tracking-[0.25em] uppercase mb-2">
              2. VOCABULARIO
            </h2>
            <h3 className="text-lg font-bold mb-2">Subtítulos inteligentes</h3>
            <p className="text-sm text-gray-300">
              Usa Language Reactor, Lingopie o Netflix con subtítulos dobles.
              Pausa, guarda frases, repite en voz alta.
            </p>
          </div>
          <div className="bg-black/80 border border-gray-800 rounded-xl p-6 box-glow">
            <h2 className="text-sm font-mono text-gray-400 tracking-[0.25em] uppercase mb-2">
              3. SPEAKING
            </h2>
            <h3 className="text-lg font-bold mb-2">Habla una vez por semana</h3>
            <p className="text-sm text-gray-300">
              1 clase en italki a la semana hablando solo de las series:
              personajes, chismes, trabajo, insultos.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://www.languagereactor.com/"
            target="_blank"
            rel="noreferrer"
            className="bg-black/90 border border-gray-800 rounded-xl p-6 box-glow hover:border-neon hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold mb-2">
                Language Reactor para Netflix/YouTube
              </h3>
              <p className="text-sm text-gray-300">
                Subtítulos dobles (inglés + español), traducciones rápidas y
                guardado de vocabulario mientras ves tus series favoritas.
              </p>
            </div>
            <span className="mt-4 text-neon text-xs font-mono tracking-[0.25em]">
              ABRIR ↗
            </span>
          </a>

          <a
            href="https://www.italki.com/"
            target="_blank"
            rel="noreferrer"
            className="bg-black/90 border border-gray-800 rounded-xl p-6 box-glow hover:border-neon hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold mb-2">italki – clases 1:1 baratas</h3>
              <p className="text-sm text-gray-300">
                Profesores nativos desde $8/hora. Lleva tus notas de series y
                practica inglés real, no diálogos del libro.
              </p>
            </div>
            <span className="mt-4 text-neon text-xs font-mono tracking-[0.25em]">
              ABRIR ↗
            </span>
          </a>
        </div>

        <div className="mt-14 border-t border-gray-900 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-400 max-w-xl">
            Plan simple:{" "}
            <span className="text-neon font-semibold">
              1 episodio al día + 10 minutos de repaso + 1 clase a la semana
            </span>
            . Nada de perfección, solo constancia.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-neon text-black font-black text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors"
          >
            Pregúntanos por tu nivel
          </Link>
        </div>
      </section>
    </div>
  );
                }
