# Guarapiranga — Conhecer a água. Preservar o futuro.

Projeto acadêmico de monitoramento da qualidade da água da Represa de Guarapiranga
(São Paulo, SP). A página apresenta a represa, a metodologia, os parâmetros analisados
e os resultados parciais das coletas, com mapa interativo e comparação com valores de
referência.

Site publicado em: https://jessicaueda.github.io/represa-guarapiranga/

## Estrutura

- `index.html` → estrutura e conteúdo da página
- `style.css` → layout, tipografia, cores e responsividade
- `script.js` → menu mobile, referências (abrir/fechar), mapa, seleção dos pontos e gráficos
- `data.json` → dados das coletas (pontos, pH, condutividade, observações)
- `images/` → imagens usadas na página

## Seções da página

- `#represa` → apresentação da Represa de Guarapiranga
- `#metodologia` → metodologia das coletas e análises
- `#preservar` → cards "Conhecer para preservar" e bloco do ODS 6 (Agenda 2030 · ONU)
- `#parametros` → parâmetros da qualidade da água
- `#resultados` → mapa, pontos de coleta, pH, condutividade e observações de campo
- `#projeto` → chamada sobre o projeto
- Fim da página (antes do rodapé) → "Referências e materiais de apoio" (abre ao clicar no "+")

## Como abrir

Abra a pasta no VS Code e rode pelo **Live Server** (botão "Go Live").

Não abra `index.html` diretamente pelo navegador (duplo clique), porque o JavaScript
usa `fetch()` para carregar o `data.json` e isso não funciona assim.

Para ver no celular, use o modo dispositivo do navegador (`F12` e depois
`Ctrl + Shift + M`) ou abra `http://IP-DO-SEU-COMPUTADOR:5500` no celular, com os dois
na mesma rede Wi-Fi.

O site precisa de internet para carregar o mapa (Leaflet e OpenStreetMap) e as fontes
(Google Fonts: DM Sans e Playfair Display).

## Imagens

Ficam na pasta `images/`:

- `logo_guarapiranga.png` → logo do cabeçalho
- `represa_guarapiranga_1.png` e `represa_guarapiranga_2.jpg` → fotos da represa
- `ods6.jpg` → selo do ODS 6
- `biodiversidade.jpg`, `gestao_ambiental.jpg`, `lazer.jpg`, `saude_publica.jpg`
  → fotos dos cards "Conhecer para preservar"
- `ponto1.jpeg` a `ponto5.jpeg` → fotos dos pontos de coleta (seção Resultados)

Para trocar uma foto, substitua o arquivo mantendo o mesmo nome.

## Onde alterar os resultados

Edite apenas `data.json`, na lista `pontos_coleta`. Cada ponto tem:

```json
{
  "id": "ponto-1",
  "nome": "Ponto 1",
  "horario_coleta": "15:50",
  "coordenadas": "23°41'45.5\"S 46°43'00.8\"W",
  "latitude": -23.6959722,
  "longitude": -46.7168889,
  "foto": "images/ponto1.jpeg",
  "cor": "Levemente amarelado",
  "odor": "Não",
  "residuos": "Não",
  "ph": 8.6,
  "condutividade_us_cm": 160.1
}
```

- `latitude` e `longitude` (em número decimal, com ponto) posicionam o marcador no mapa.
- `coordenadas` é o texto que aparece no card; se faltar, o site mostra latitude e longitude.
- `foto` é o caminho da foto do ponto, que aparece abaixo do mapa. Se o campo faltar ou o
  arquivo não existir, o site mostra "Foto não disponível".
- `ph` e `condutividade_us_cm` são números, com ponto como separador decimal.
- Para incluir um novo ponto, copie um bloco inteiro, troque `id` e `nome` e atualize os valores.
- O campo `observacao` (no final do arquivo) guarda a nota sobre os dados.
- A lista `indicadores` pertence a uma seção de cards de indicadores que hoje não aparece
  na página (o `index.html` não tem mais o elemento `#indicatorGrid`). Pode ser mantida ou removida.

## Valores de referência (pH e condutividade)

Cada card de pH e de condutividade mostra a faixa de referência na barra, um selo
("Dentro", "Abaixo" ou "Acima da referência") e, se o valor estiver fora da faixa, uma
explicação do que isso pode significar.

- **pH:** 6,0 a 9,0, conforme a Resolução CONAMA nº 357/2005
- **Condutividade elétrica:** abaixo de 100 µS/cm, conforme a CETESB
  (valores a partir disso indicam ambientes impactados; é um indicador, não um limite legal)

Para mudar os limites ou os textos, edite na seção "07" do `script.js`:
`PH_REF`, `COND_REF`, `evaluatePh()` e `evaluateConductivity()`.

## Referências bibliográficas

Ficam no final do `index.html`, na lista `<ul class="references-list">`, em formato ABNT
e em ordem alfabética. Para incluir uma nova, copie um bloco `<li> ... </li>` e mantenha
a ordem alfabética.

## Personalização rápida

- Cores: variáveis no início do `style.css` (`:root`).
- Cards "Conhecer para preservar": seção `.preserve-card` no final do `style.css`
  (tempo e suavidade da transição, espaçamento entre título e texto).
- Favicon: adicione `<link rel="icon" href="images/favicon.ico">` no `<head>` do `index.html`.

## Publicação

O site é publicado pelo GitHub Pages. Depois de enviar as alterações para o repositório,
pode levar alguns minutos para a versão online atualizar (use `Ctrl + Shift + R` para
limpar o cache do navegador).
