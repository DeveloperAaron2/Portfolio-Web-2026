"use client";

import Link from "next/link";

const iconClass =
  "h-5 w-5 text-neutral-600 transition-colors group-hover:text-neutral-900";

export default function SimpleFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">

          {/* Recursos */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Recursos</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/cv"
                  className="inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  CV
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              Redes sociales
            </h4>

            <ul className="mt-3 flex gap-4">
              {/* GitHub */}
              <li>
                <Link
                  href="https://github.com/DeveloperAaron2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2"
                  aria-label="GitHub"
                >
                  <svg
                    className={iconClass}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.28 3.438 9.75 8.205 11.325.6.112.82-.262.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.234 1.91 1.234 3.22 0 4.61-2.807 5.623-5.48 5.92.43.37.823 1.096.823 2.21 0 1.594-.015 2.878-.015 3.27 0 .323.216.7.825.58C20.565 22.245 24 17.78 24 12.5 24 5.87 18.627.5 12 .5z" />
                  </svg>
                </Link>
              </li>

              {/* LinkedIn */}
              <li>
                <Link
                  href="https://www.linkedin.com/in/aaron-borrego-maganto-968b892a0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center"
                  aria-label="LinkedIn"
                >
                  <svg
                    className={iconClass}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0H12v2.2h.07c.63-1.2 2.17-2.47 4.47-2.47C21.33 7.73 24 10.42 24 15.35V24h-5v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24h-5V8z" />
                  </svg>
                </Link>
              </li>

              {/* Email */}
              <li>
                <Link
                  href="mailto:borregomagantoaaron@gmail.com"
                  className="group inline-flex items-center"
                  aria-label="Email"
                >
                  <svg
                    className={iconClass}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
