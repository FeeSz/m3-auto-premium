import Link from "next/link";
import { dealership } from "@/lib/dealership";
export function LegalPage({ kind }: { kind: "privacy" | "cookies" | "terms" }) {
  const title =
    kind === "privacy"
      ? "Política de Privacidade"
      : kind === "cookies"
        ? "Política de Cookies"
        : "Termos de Uso";
  return (
    <article className="container article-layout legal-layout">
      <header className="article-heading">
        <p className="eyebrow">INFORMAÇÕES LEGAIS · 18 SET 2026</p>
        <h1>{title}</h1>
        <p>Informações sobre esta versão do site da M3 Auto Premium.</p>
      </header>
      <div className="article-body">
        <p className="legal-status">
          Versão inicial. A identificação jurídica completa e as informações
          sobre o atendimento após o contato serão complementadas pela M3 antes
          da publicação definitiva.
        </p>
        {kind === "privacy" ? (
          <>
            <h2>1. Quem está por trás deste site</h2>
            <p>
              Este site apresenta a {dealership.name}, localizada em{" "}
              {dealership.address}. Para dúvidas sobre privacidade e
              atendimento, utilize o telefone {dealership.phone} ou a{" "}
              <Link href="/contato">página de contato</Link>. Razão social, CNPJ
              e canal específico de privacidade aguardam confirmação.
            </p>
            <h2>2. Informações que você preenche</h2>
            <p>
              Os formulários permitem informar nome, telefone, e-mail opcional,
              interesse e mensagem. Na avaliação, incluem informações do
              veículo. No financiamento, incluem veículo de interesse, entrada
              prevista e prazo desejado. Não solicitamos CPF, documentos, conta
              bancária ou dados de cartão nesta etapa.
            </p>
            <h2>3. Como funciona o contato</h2>
            <p>
              Os dados preenchidos ficam na memória da página para preparar uma
              mensagem. O formulário não envia esses dados a um servidor da M3.
              Você pode revisar e editar o texto antes de escolher “Abrir no
              WhatsApp”. Ao clicar nesse link, o conteúdo da mensagem será
              encaminhado ao serviço WhatsApp para abrir a conversa. O envio da
              mensagem à M3 será confirmado por você dentro do WhatsApp.
            </p>
            <p>
              A solicitação permite à equipe responder ao seu interesse e
              orientar os próximos passos. O preenchimento não representa adesão
              a campanhas publicitárias.
            </p>
            <h2>4. Serviços de terceiros</h2>
            <p>
              O mapa só é carregado quando você escolhe “Carregar Google Maps”.
              Essa ação conecta seu navegador ao Google, que pode receber dados
              técnicos de conexão. Os links para Google e WhatsApp levam a
              serviços com suas próprias políticas. As fontes são locais.
              Fotografias de anúncios podem ser obtidas do fornecedor Usadosbr
              pelo servidor de imagens.
            </p>
            <h2>5. Armazenamento</h2>
            <p>
              Esta interface não grava o conteúdo dos formulários em cookies,
              localStorage ou banco de dados. Recarregar ou sair da página
              descarta os campos. Após abrir serviços externos, o tratamento
              realizado por esses serviços segue suas políticas. Os prazos e
              procedimentos da M3 para mensagens recebidas serão documentados
              antes da operação definitiva.
            </p>
            <h2>6. Seus direitos</h2>
            <p>
              Você pode entrar em contato para solicitar informações sobre o
              tratamento, acesso ou correção de dados e exercer os direitos
              aplicáveis previstos na LGPD, incluindo exclusão ou revogação de
              consentimento quando cabíveis. A equipe poderá precisar confirmar
              sua identidade para atender à solicitação.
            </p>
            <p>
              Consulte a{" "}
              <a
                href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados"
                target="_blank"
                rel="noreferrer"
              >
                orientação da ANPD para titulares de dados
              </a>
              .
            </p>
            <h2>7. Atualizações</h2>
            <p>
              Esta política deve ser atualizada caso sejam adicionados novos
              fornecedores, formulários com envio ao servidor, ferramentas de
              análise ou publicidade. A data de revisão ficará indicada nesta
              página.
            </p>
          </>
        ) : kind === "cookies" ? (
          <>
            <h2>1. O que são cookies</h2>
            <p>
              Cookies são pequenos registros que um site pode armazenar no
              navegador. Eles podem apoiar funcionalidades, preferências ou
              medição de uso.
            </p>
            <h2>2. O que esta versão utiliza</h2>
            <p>
              Esta versão não implementa cookies de publicidade, rastreamento ou
              ferramentas de análise. A busca e os filtros usam a URL da página
              para permitir compartilhar resultados. Os formulários não
              persistem informações no navegador. Não há banner de aceitação
              porque não há cookies opcionais próprios a autorizar.
            </p>
            <h2>3. Conteúdo externo</h2>
            <p>
              O Google Maps é opcional e depende de uma ação sua para carregar.
              Ao ativá-lo, você se conecta ao Google. Os links de WhatsApp e
              Google Maps também podem abrir serviços externos que usam
              tecnologias próprias, sob suas políticas.
            </p>
            <h2>4. Suas escolhas</h2>
            <p>
              Você pode navegar sem carregar o mapa. O endereço permanece
              disponível em texto e o atendimento pode ser realizado por
              telefone. Para gerenciar cookies de terceiros, consulte os
              controles do seu navegador e as opções do serviço correspondente.
            </p>
            <h2>5. Mudanças futuras</h2>
            <p>
              Se ferramentas opcionais forem adicionadas, esta página e os
              controles de escolha deverão ser atualizados antes da ativação.
              Consulte também nossa{" "}
              <Link href="/privacidade">Política de Privacidade</Link>.
            </p>
            <p>
              Referência:{" "}
              <a
                href="https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais"
                target="_blank"
                rel="noreferrer"
              >
                guia de cookies da ANPD
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h2>1. Apresentação</h2>
            <p>
              Este site apresenta a M3 Auto Premium e permite iniciar conversas
              sobre compra, venda, troca e financiamento de veículos. O
              atendimento pode ser solicitado por WhatsApp ou telefone.
            </p>
            <h2>2. Informações do estoque</h2>
            <p>
              O catálogo reúne os anúncios públicos da M3 consultados na data
              indicada em cada ficha. O estoque pode mudar entre atualizações.
              Disponibilidade, preço, características, documentação e condições
              devem ser confirmados diretamente com a M3.
            </p>
            <h2>3. Solicitações e propostas</h2>
            <p>
              Preencher um formulário não reserva um veículo, conclui uma
              compra, aceita uma proposta ou garante aprovação de crédito. Uma
              negociação depende de atendimento, verificações e formalização
              próprias.
            </p>
            <h2>4. Avaliação e financiamento</h2>
            <p>
              A avaliação de um veículo depende de inspeção e análise das
              informações e documentos. As condições de financiamento dependem
              da instituição financeira. Antes de contratar, solicite as
              condições completas, incluindo o Custo Efetivo Total e o contrato.
            </p>
            <p>
              Saiba mais na{" "}
              <a
                href="https://www.bcb.gov.br/meubc/faqs/p/cuidados-na-hora-de-contratar-uma-operacao-de-credito"
                target="_blank"
                rel="noreferrer"
              >
                orientação do Banco Central sobre contratação de crédito
              </a>
              .
            </p>
            <h2>5. Uso responsável</h2>
            <p>
              Informe dados corretos e apenas informações necessárias ao
              atendimento. Não envie documentos ou dados de terceiros sem
              autorização. O uso do site deve respeitar a legislação brasileira
              e os direitos de outras pessoas.
            </p>
            <h2>6. Conteúdo e serviços externos</h2>
            <p>
              As fotos do catálogo vêm dos anúncios dos respectivos veículos.
              Fotografias editoriais genéricas de serviços são identificadas
              como ilustrativas. Links para serviços externos funcionam sob os
              termos dos respectivos fornecedores.
            </p>
            <h2>7. Atendimento</h2>
            <p>
              Para esclarecer dúvidas sobre estas informações, fale com a M3
              pelo telefone {dealership.phone}. Consulte a{" "}
              <Link href="/privacidade">Política de Privacidade</Link> para
              entender o uso dos dados. Estes termos não limitam os direitos
              previstos na legislação brasileira.
            </p>
          </>
        )}
      </div>
    </article>
  );
}
