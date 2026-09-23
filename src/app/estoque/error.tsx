"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container inventory-heading" role="alert">
      <h1>Não foi possível carregar o estoque.</h1>
      <p>Tente novamente ou fale com a M3 pela página de contato.</p>
      <button className="cta" onClick={reset}>
        <span>Tentar novamente</span>
      </button>
    </div>
  );
}
