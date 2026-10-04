# Guarapiranga — Landing Page

Estrutura:

- `index.html` → estrutura e conteúdo da página
- `style.css` → layout, tipografia, cores e responsividade
- `script.js` → menu mobile, filtros dos resultados e carregamento do JSON
- `data.json` → dados dos indicadores
- `assets/` → imagens usadas na página

## Como abrir

Abra a pasta no VS Code e rode pelo **Live Server**.

Não abra `index.html` diretamente pelo navegador, porque o JavaScript usa `fetch()` para carregar o `data.json`.

## Imagens

Coloque suas imagens em:

- `assets/hero.jpg`
- `assets/represa.jpg`

A página funciona mesmo sem as imagens, usando as cores de fundo como fallback.

## Onde alterar os resultados

Edite apenas `data.json`.

Exemplo:

```json
{
  "id": "ph",
  "nome": "pH",
  "descricao": "Acidez ou alcalinidade",
  "valor": "7,2",
  "status": "• resultado obtido",
  "categoria": "fisico-quimicos",
  "icone": "◌"
}
```
