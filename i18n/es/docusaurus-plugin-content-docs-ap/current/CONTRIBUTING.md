---
draft: true
---

# Bienvenido a Anchor Platform Madness <!-- omit in toc -->

¡Hola y bienvenido al hogar de la documentación de Anchor Platform recientemente versionado!

Estamos muy contentos de tenerte aquí, y esperamos que este documento te ayude a entender cómo (y lo más importante, _donde_) hacer los cambios necesarios en nuestra documentación. Comencemos con un poco de vocabulario de Docusaurus, ¿te parece?

## Resumen

- Para versiones _no publicadas_ de Anchor Platform:
  - Agrega y edita documentos en `/platforms/anchor-platform`
  - Actualiza y regenera la documentación de la API en `/openapi/anchor-platform/main-*.yaml`
- Para versiones _publicadas_ de Anchor Platform:
  - Actualiza y cambia documentos en `/ap_versioned_docs`
  - Actualiza y regenera la documentación de la API en `/openapi/anchor-platform/versions/*.yaml`

Publica una **nueva versión** usando el siguiente script de yarn:

```bash
# replace `3.0.0` with the needed version
VERSION=3.0.0 yarn ap:versions:new
```

> _Nota:_ Creo que el comando de yarn anterior es actualmente incompatible con Windows, aunque podría estar equivocado.

Regenera la documentación de la API para versiones **ya publicadas** usando el siguiente script de yarn. Esto regenera la documentación de la API para **todas** las versiones publicadas, así que puede que quieras ser juicioso sobre qué archivos añades a tu commit.

```bash
yarn ap:versions:regen
```

## Tabla de Contenidos <!-- omit in toc -->

- [Resumen](#tldr)
- [Más sobre Docusaurus de lo que nunca quisiste saber](#more-about-docusaurus-than-you-ever-wanted-to-know)
  - [Nomenclatura de Versiones](#versions-nomenclature)
  - [Plugins](#plugins)
  - [Instancias](#instances)
  - [Enlaces](#links)
    - [Ejemplos](#examples)
- [Directorios para Conocer](#directories-to-know)
  - [Directorios que Ya Conoces](#directories-you-already-know-about)
  - [Nuevos Directorios](#new-shiny-directories)
- [Crear Nuevas Versiones](#making-new-versions)
  - [Usar Docusaurus para "Etiquetar" un Nueva Publicación](#use-docusaurus-to-tag-a-new-release)
  - [Configurar el plugin OpenAPI](#configure-the-openapi-plugin)
    - [Copiar los archivos de especificación OpenAPI (agrupados) al directorio versionado](#copy-the-bundled-openapi-specfiles-to-the-versioned-directory)
    - [Agregar configuración a la instancia del plugin OpenAPI](#add-configuration-to-the-openapi-plugin-instance)
- [Actualizar Versiones Antiguas](#updating-old-versions)
  - [Actualizar Páginas de Documentación](#update-documentation-pages)
  - [Actualizar Especificación de API](#update-api-specification)

## Más sobre Docusaurus de lo que nunca quisiste saber

Sé que puede parecer un poco misterioso, pero aquí tienes algo de conocimiento y contexto para ayudarte a entender lo que está por venir.

### Nomenclatura de Versiones

Así es como Docusaurus define estos términos, así que eso es lo que usaré en este documento también.

- La **versión actual** se refiere a la versión de los documentos de AP contenidos en el directorio `/platforms/anchor-platform`. Este conjunto de documentos está disponible en la URL `/platforms/anchor-platform/next`. Este es el conjunto de documentos "en construcción". Este es el conjunto de documentos "en construcción".

- La **última versión** se refiere al conjunto de documentos de AP que ha sido "publicado" más recientemente. Estos se encuentran en `/ap_versioned_docs` (más sobre eso más adelante), y está disponible en la URL `/platforms/anchor-platform`. Este es el conjunto de documentos "estables". Este es el conjunto de documentos "estables".

### Plugins

Hay dos plugins de Docusaurus en juego aquí:

1. `@docusaurus/plugin-content-docs` es el caballo de batalla de Docusaurus. Se encarga del renderizado de markdown, enrutamiento, etc. Cuando piensas en actualizar `some-file.mdx`, este es el plugin que estás utilizando.
2. `docusaurus-plugin-openapi-docs` es el plugin que se utiliza para generar páginas MDX a partir de los archivos de especificación de OpenAPI. Este plugin es capaz de versionar por sí mismo, aunque se debe tener cuidado y consideración con respecto a su configuración.

Ambas configuraciones de plugins se han separado en un archivo `/config/anchorPlatform.config.ts`, para facilitar su gestión y despejar un poco el archivo principal `docusaurus.config.ts`.

### Instancias

Aquí es donde se pone un poco más "profundo", pero prometo que esta parte es útil de conocer. Ambos [plugins](#plugins) que mencioné anteriormente son realmente solo _instancias_ de esos dos plugins. De hecho, cada uno de esos plugins se utiliza en otras partes de nuestro sitio de documentación para Horizon, SDP, y simplemente documentación "regular". No es _generalmente_ importante considerar diferentes instancias de plugins, pero _sí_ es **bastante relevante** cuando discutimos enlaces. Así que...

### Enlaces

La mayoría de las veces, **especialmente en documentos versionados**, es importante [enlazar a otros documentos por _rutas de archivos relativas_](https://docusaurus.io/docs/versioning#link-docs-by-file-paths).
Esto permite a Docusaurus reescribir URLs cuando sea necesario en el momento de la construcción.

¡Sin embargo, hay una **GRAN EXCEPCIÓN**! Docusaurus solo puede manejar estos enlaces cuando ambos, los archivos fuente y destino, son procesados por la misma _instancia de plugin_.
Así que, en términos prácticos:

- Si estás enlazando desde **y** hacia documentos MDX _dentro_ de la misma instancia de plugin de documentos, usa _rutas de archivos relativas_.
- Si estás enlazando _a través_ de instancias de plugins, **debes** usar _rutas URL_. Por convención, también usamos _rutas absolutas_ para esto, para que sea un poco más obvio cuándo está ocurriendo este comportamiento.

#### Ejemplos

Esto debería ayudarte a aclarar un poco.

- Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/admin-guide/sep6/configuration.mdx` _hasta_ el documento MDX `/platforms/anchor-platform/api-reference/platform/rpc/methods/notify_amounts_updated.mdx`:
  - Estamos en la misma instancia de plugin `/platforms/anchor-platform`
  - Usa una _ruta de archivo relativa_
  - Enlaza a ella `[algo como esto](../../api-reference/platform/rpc/methods/notify_amounts_updated.mdx)`
- Quiero enlazar _desde_ el documento MDX `/docs/learn/fundamentals/anchors.mdx` _hasta_ el documento MDX `/platforms/anchor-platform/admin-guide/getting-started.mdx`
  - Estamos "cruzando" entre las instancias de plugin `/docs` y `/platforms/anchor-platform`
  - Usa una _ruta URL absoluta_
  - Enlaza a ella `[algo como esto](/platforms/anchor-platform/admin-guide/getting-started)` (nota que no hay extensión `.mdx`)
- Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/custody/README.mdx` _hasta_ el documento MDX `/docs/tools/developer-tools/wallets.mdx`
  - Estamos "cruzando" entre las instancias de plugin `/platforms/anchor-platform` y `/docs`
  - Usa una _ruta URL absoluta_
  - Enlaza a ella `[algo como esto](/docs/tools/developer-tools/wallets)` (nota que no hay extensión `.mdx`)
- ¡Wildcard! Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/admin-guide/custody-services/configuration.mdx` _hasta_ el documento MDX `/platforms/stellar-disbursement-platform/admin-guide/60-anchor-platform-integration-points.mdx`
  - Estamos "cruzando" entre las instancias de plugin `/platforms/anchor-platform` y `/platforms/stellar-disbursement-platform`
  - Usa una _ruta URL absoluta_
  - Enlaza a ella `[algo como esto](/platforms/stellar-disbursement-platform/admin-guide/anchor-platform-integration-points)` (nota que no hay extensión `.mdx`)

> _Nota:_ Reemplaza la instancia del plugin `/platforms/anchor-platform` con la instancia del plugin `/platforms/stellar-disbursement-platform` en los ejemplos anteriores, y todo funcionará prácticamente igual.

Lee más sobre enlaces [aquí](https://docusaurus.io/docs/markdown-features/links) (especialmente hacia la parte inferior de la página).

## Directorios a Conocer

Hay varios directorios que _todos_ alimentan el producto final que es nuestra documentación versionada de AP.

### Directorios que Ya Conoces

- `/platforms/anchor-platform` Aquí es donde estás ahora, y tradicionalmente ha sido el lugar para modificar cualquier contenido de markdown que se convierte en nuestras páginas de documentación de AP. No ha cambiado mucho aquí, excepto que requiere un cambio de mentalidad.
  **Toda la documentación y contenido ubicado aquí ahora debe considerarse la versión `actual` (en construcción) de los documentos de AP.** Así que, mientras construimos para `v3.x` (y más allá, finalmente), querrás actualizar _contenido aquí_.
  Los lectores aún podrán _ver_ este contenido antes de que sea "publicado", pero se les dirá que es la versión no publicada.

  También hay un nuevo directorio aquí que debes conocer:

  - `/platforms/anchor-platform/assets` Dado que es probable que las diversas imágenes, diagramas, etc. necesiten actualizarse/cambiarse de una versión a otra, estamos co-localizando los activos relevantes en este directorio. Esto permite que también sean versionados. Esto permite que también sean versionados. Si quieres actualizar un diagrama o imagen para una próxima publicación, debes hacerlo aquí.

- `/openapi/anchor-platform` Este es el mismo lugar que probablemente ya conoces. Los archivos han sido renombrados recientemente, pero en su mayor parte querrás modificar `main-{platform,callbacks,custody}.yaml`, que luego se "agrupará" más tarde en el archivo agrupado que contiene todo en un solo archivo.
  **Los archivos en este directorio también deben considerarse la versión `actual` (en construcción) de los documentos de especificación de AP.** Así que, mientras construimos para `v3.x` (y más allá, finalmente), querrás actualizar _archivos de especificación aquí_.

  También hay un nuevo directorio aquí que debes conocer:

  - `/openapi/anchor-platform/versions` Este directorio almacena una copia de los archivos de especificación _agrupados_ para cada versión que se publica. El plugin que usamos para generar la documentación de la API para estos archivos de especificación se configura para utilizar _estas_ especificaciones versionadas para toda la documentación no `actual`.

- `/openrpc/src/anchor-platform` Recientemente, movimos la especificación RPC a este directorio para que pueda beneficiarse de los mismos procesos de construcción y cheques de validación que la especificación `stellar-rpc`. Similar a los otros directorios cubiertos hasta ahora, cualquier cambio en estos archivos debe considerarse en la versión `actual` (en construcción) de la documentación. No hay (¿aún?) una gran cantidad de herramientas o ergonomía en torno a la actualización de las versiones "antiguas" de estas especificaciones. La versión `actual` de la especificación se genera en `/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json`.
  Esto significa que _sí_ se incluye en el proceso de versionado, por lo que cualquier cambio en las versiones "antiguas" probablemente solo necesitará hacerse en esos archivos de especificación versionados por ahora (más sobre eso en la siguiente sección).

### Nuevos Directorios Brillantes

- `/ap_versioned_sidebars` Podemos pasar rápidamente por este. Cuando haces una nueva versión de los documentos, Docusaurus guarda una copia de la barra lateral en ese momento. Realmente no deberías preocuparte por nada aquí.

- `/ap_versioned_docs` Aquí es donde residen los conjuntos "publicados" de los documentos de AP.
  Cada vez que se publica una versión, _todo_ desde el directorio `/platforms/anchor-platform` se copia en un subdirectorio aquí.
  Notarás que ya tenemos una versión `v2.8.4` aquí. A medida que publiquemos `v3.x`, se colocará una _nueva_ copia de los archivos aquí. La copia `más reciente` (estable) de la documentación de AP se extrae del directorio. Si te encuentras con algo que corregir o actualizar en una versión publicada de los documentos, necesitarás actualizarlo en consecuencia aquí.

## Crear Nuevas Versiones

Como se mencionó en el [TL;DR](#tldr), este proceso está automatizado con el script `VERSION=3.0.0 yarn ap:versions:new`. Sin embargo, aquí está lo que está sucediendo bajo el capó de ese script.

### Usar Docusaurus para "Etiquetar" una Nueva Publicación

¡Es realmente bastante simple! Usa el CLI de Docusaurus para hacer una nueva publicación:

```bash
# `ap` is the ID of the AP `@docusaurus/plugin-content-docs` plugin instance
yarn docusaurus docs:version:ap 3.0.0
```

Eso hace una nueva copia de los documentos en `/ap_versioned_docs`, y funcionará bastante bien para mostrar la nueva versión en el sitio. Cualquier cambio futuro en la versión 3.0.0 de los documentos debería hacerse en el directorio `/ap_versioned_docs`.

### Configurar el plugin OpenAPI

También querrás poder modificar/actualizar/regenerar la documentación de la API si surge la necesidad. Así que, necesitaremos configurar la instancia del plugin `docusaurus-plugin-openapi-docs` en consecuencia.

#### Copiar los archivos de especificación OpenAPI (agrupados) al directorio versionado

En este momento, es tan simple como copiar los archivos:

```bash
cp openapi/anchor-platform/bundled-platform.yaml openapi/anchor-platform/versions/platform-3.0.0.yaml
cp openapi/anchor-platform/bundled-callbacks.yaml openapi/anchor-platform/versions/callbacks-3.0.0.yaml
cp openapi/anchor-platform/bundled-custody.yaml openapi/anchor-platform/versions/custody-3.0.0.yaml
```

> Nota cómo estamos copiando el archivo _agrupado_, no el archivo _principal_. Esto asegura que el archivo versionado contenga todo lo que necesita.

#### Agregar Configuración a la Instancia del Plugin OpenAPI

> _Nota_: Estas partes de `versions` de la configuración ahora se generan dinámicamente, usando una función `makeVersions()`, por lo que estos pasos de configuración manual no deberían ser necesarios. Puede que desees avanzar/ajustar la cadena `anchorPlatformNextVersion` en el archivo de configuración, cuando publiques una nueva versión de los documentos, sin embargo.

Para poder usar el CLI del plugin para actualizar versiones ya lanzadas,
tenemos que actualizar la configuración en `/config/anchorPlatform.config.ts`. Haz
a una nueva entrada en cada uno de los objetos `versions` de los archivos de especificación, y copia el formato
de las entradas que ya están. Como referencia, así es como se ve actualmente
para el "servidor de plataforma" en `v2.8.4`:

```typescript
ap_platform: {
  specPath: "openapi/anchor-platform/bundled-platform.yaml",
  outputDir: "platforms/anchor-platform/api-reference/platform/transactions",
  hideSendButton: true,
  template: "src/template.mustache",
  version: "3.0.0",
  label: "v3.0.0",
  baseUrl: '/platforms/anchor-platform/next/api-reference/platform/transactions',
  versions: {
    "2.8.4": {
      specPath: "openapi/anchor-platform/versions/platform-2.8.4.yaml",
      outputDir: "ap_versioned_docs/version-2.8.4/api-reference/platform/transactions",
      label: "v2.8.4",
      baseUrl: "/platforms/anchor-platform/api-reference/platform/transactions"
    }
  }
}
```

## Actualizar Versiones Antiguas

### Actualizar Páginas de Documentación

Supongamos que encuentro un error tipográfico en la documentación de la Guía de Administrador `v2.8.4`. Busca
el archivo relevante en el directorio `/ap_versioned_docs/version-2.8.4`, corrígelo
y haz un commit. Las actualizaciones de contenido son bastante fáciles aquí.

> _Nota_ Dado que la especificación RPC se trata de manera similar a la documentación de MDX, usa el
> mismo proceso para hacer actualizaciones en el archivo de especificación RPC. Para `v2.8.4`, se encuentra
> aquí:
> `/ap_versioned_docs/version-2.8.4/api-reference/platform/rpc/anchor-platform.openrpc.json`

### Actualizar Especificación de API

Esto es un poco más complicado, pero no mucho. Busca y cambia la(s)
parte(s) relevante(s) del
`/openapi/anchor-platform/versions/{platform, callbacks,custody}-2.8.4.yaml`
specfile.

Luego, regenera las páginas MDX:

```bash
# `ap-apis` is the ID of the AP `docusaurus-plugin-openapi-docs` plugin instance
yarn docusaurus gen-api-docs:version -p ap-apis:2.8.4
```

> _Nota:_ Puedes usar un script de yarn para regenerar automáticamente la documentación de la API para
> **todas** las versiones lanzadas: `yarn ap:versions:regen`. Esto realmente
> regenera todas las versiones, así que es posible que quieras ser selectivo acerca de qué archivos
> agregas al commit.

Haz el commit de los cambios y estarás listo.
