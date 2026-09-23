import { getVehicles } from "@/data/vehicles";
export interface Article {
  slug: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
}
export async function getArticles(): Promise<Article[]> {
  const vehicles = await getVehicles();
  const heroVehicle = vehicles.find(
    (v) => v.model === "HR-V" && v.year === 2023,
  )!;
  const articles: Article[] = [
    {
      slug: "como-escolher-seu-proximo-carro",
      title: "Seu próximo veículo começa com as perguntas certas.",
      summary:
        "Uso, espaço e experiência ao conduzir: um roteiro para encontrar um veículo que faça sentido na sua rotina.",
      date: "2026-09-15",
      image: heroVehicle.coverImage!,
      category: "Guia de compra",
      sections: [
        {
          heading: "Comece pela sua rotina",
          paragraphs: [
            "Antes de escolher um modelo, pense nos trajetos que você faz. Uma viagem de fim de semana, o caminho para o trabalho e os compromissos da família pedem coisas diferentes de um veículo.",
            "Anote o que é indispensável: espaço para passageiros, porta-malas, facilidade para estacionar e conforto em percursos longos. Essa lista ajuda a comparar veículos com clareza.",
          ],
        },
        {
          heading: "Conheça o veículo de perto",
          paragraphs: [
            "Fotografias são um bom começo. A visita permite avaliar posição de dirigir, visibilidade, acesso aos comandos e acabamento. Reserve tempo para conhecer o veículo sem pressa.",
          ],
          list: [
            "Experimente a regulagem do banco e do volante.",
            "Confira espaço e acessos com todos os passageiros em mente.",
            "Converse sobre manutenção, documentação e histórico disponível.",
          ],
        },
        {
          heading: "O que observar no test drive",
          paragraphs: [
            "Escolha, quando possível, um percurso parecido com o seu uso diário. Observe a resposta da direção, o conforto da suspensão e a facilidade para manobrar.",
            "O objetivo é perceber como você se sente ao volante. Leve suas dúvidas ao consultor e peça explicações sobre recursos que ainda não conhece.",
          ],
        },
        {
          heading: "Compare a experiência completa",
          paragraphs: [
            "Além do preço de compra, considere os custos recorrentes que você terá com o veículo. Consulte cotações adequadas ao seu perfil e evite decidir apenas por uma fotografia ou por um único equipamento.",
            "Na M3 Auto Premium, a conversa começa pelo veículo que você procura. Entre em contato para conhecer as opções disponíveis.",
          ],
        },
      ],
    },
    {
      slug: "prepare-seu-carro-para-avaliacao",
      title: "Vai trocar de veículo? Prepare-se para a avaliação.",
      summary:
        "Organize as informações do seu veículo e aproveite melhor a conversa sobre troca ou venda.",
      date: "2026-09-15",
      image: "/reference/TcgsebcRv5iSa7dvNbl6PMQECA.webp",
      category: "Venda e troca",
      sections: [
        {
          heading: "Reúna as informações básicas",
          paragraphs: [
            "Marca, modelo, versão, ano e quilometragem são o ponto de partida. Anote também os equipamentos e as características que ajudam a identificar a configuração.",
          ],
          list: [
            "Modelo e versão completos.",
            "Ano de fabricação e ano-modelo.",
            "Quilometragem atual e histórico disponível.",
          ],
        },
        {
          heading: "Um histórico organizado facilita a conversa",
          paragraphs: [
            "Separe os registros de manutenção que você possui. Informe reparos, alterações e detalhes de conservação de forma transparente.",
            "Não é necessário esconder marcas de uso. Uma avaliação considera o estado do conjunto e depende da inspeção do veículo.",
          ],
        },
        {
          heading: "Fotografias que ajudam",
          paragraphs: [
            "Fotografe o veículo em um local claro, mostrando frente, traseira, laterais e interior. Registre os detalhes relevantes sem filtros que alterem a aparência.",
            "Evite incluir documentos pessoais, rostos ou dados que não sejam necessários na primeira conversa.",
          ],
        },
        {
          heading: "Entenda as próximas etapas",
          paragraphs: [
            "O contato inicial organiza a avaliação. Uma proposta depende da análise das informações, da documentação e da inspeção presencial.",
            "Converse com a M3 sobre vender seu veículo ou usá-lo como parte do pagamento do próximo.",
          ],
        },
      ],
    },
    {
      slug: "conforto-e-performance",
      title: "Conforto e performance podem dividir a mesma garagem.",
      summary:
        "Entenda o que observar ao comparar diferentes propostas de carroceria e experiência de condução.",
      date: "2026-09-15",
      image: vehicles.find((v) => v.model === "Nivus")!.coverImage!,
      category: "Universo premium",
      sections: [
        {
          heading: "Cada veículo tem uma proposta",
          paragraphs: [
            "Um cupê, uma perua e um SUV podem compartilhar a atenção ao acabamento e oferecer experiências distintas. A melhor escolha começa pela forma como você pretende usar o veículo.",
          ],
        },
        {
          heading: "Observe os detalhes de uso",
          paragraphs: [
            "Altura de acesso, posição de dirigir, espaço para bagagem e visibilidade mudam a experiência cotidiana. Confira esses pontos durante a visita.",
          ],
          list: [
            "Acesso aos bancos e porta-malas.",
            "Conforto em diferentes posições.",
            "Facilidade para manobrar e estacionar.",
          ],
        },
        {
          heading: "Faça uma comparação com calma",
          paragraphs: [
            "Experimente os modelos que fazem sentido para você e registre suas impressões. Recursos e configurações variam entre versões, por isso confirme a ficha do exemplar que está conhecendo.",
            "O prazer de conduzir também passa por sentir que o veículo combina com o seu dia a dia.",
          ],
        },
        {
          heading: "Converse com quem vai acompanhar sua escolha",
          paragraphs: [
            "Traga suas prioridades para a M3 Auto Premium. Nossa proposta é ajudar você a conhecer as opções e esclarecer as informações de cada veículo antes de decidir.",
          ],
        },
      ],
    },
  ];
  return articles;
}
export const articleDate = (d: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(d + "T12:00:00Z"));
