const faqs = [
  {
    question: "What is skai faux leather made from?",
    answer: "skai upholstery materials combine a textile backing with a PVC or PU coating. Embossing creates leather-like grains and other textures. Check each Article for its composition.",
  },
  {
    question: "Where can skai materials be used?",
    answer: "Applications include residential furniture, hospitality, public spaces and healthcare. Suitable materials can also cover wall panels and headboards. Each Article lists its intended uses.",
  },
  {
    question: "Can skai upholstery be used outdoors?",
    answer: "Selected outdoor ranges offer resistance to sunlight and demanding environments. Choose an Article marked Outdoor and check its specifications for your project.",
  },
  {
    question: "Is skai suitable for heavy-use furniture?",
    answer: "skai offers durable, easy-care upholstery for demanding settings. Compare the individual Article’s abrasion resistance and other performance data when choosing a material.",
  },
  {
    question: "Are all skai materials flame-retardant?",
    answer: "Fire performance varies by range. Check the Article’s listed fire tests against your project requirements; one material’s results do not apply to the entire collection.",
  },
  {
    question: "Is faux leather always vegan?",
    answer: "Vegan status depends on the ingredients. Many skai products carry PETA-Approved Vegan certification; confirm the status of your selected Article.",
  },
  {
    question: "How should I clean skai upholstery?",
    answer: "Remove spills promptly using a damp microfiber or cotton cloth and a mild, warm soapy solution. Test cleaners on an inconspicuous area and follow the material’s care instructions. Avoid solvents and oil-based cleaners. For disinfection, use skai’s product-specific recommendations.",
  },
];

export function SkaiCollectionFaq() {
  return (
    <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:py-28" data-nav-invert id="faq">
      <div className="section-shell">
        <h2 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal">FAQ</h2>
        <div className="mx-auto mt-14 max-w-[46rem]">
          <div className="border-t border-charcoal/10">
            {faqs.map((item) => (
              <details className="group border-b border-charcoal/10 py-5" key={item.question}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 text-left marker:hidden">
                  <span className="label-caps block text-[10px] text-charcoal">{item.question}</span>
                  <span aria-hidden="true" className="shrink-0 font-sans text-xl leading-none text-muted transition-transform duration-300 ease-expo group-open:rotate-45 motion-reduce:transition-none">+</span>
                </summary>
                <p className="mt-3 pr-10 text-[0.8rem] leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
