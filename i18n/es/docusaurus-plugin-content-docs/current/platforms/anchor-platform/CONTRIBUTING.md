---
draft: true
---

# Bienvenido a Anchor Platform Madness <!-- omit in toc -->

¡Hola, y bienvenido a la nueva versión de la documentación de Anchor Platform!

Estamos muy contentos de tenerte aquí, y esperamos que este documento te ayude a comprender cómo (y más importante, _dónde_) hacer los cambios necesarios en nuestra documentación. Comencemos con un poco de vocabulario de Docusaurus, ¿de acuerdo?

## ¡AVISO! AP HA SIDO DESVERSIONADO

La documentación de Anchor Platform ha sido desversionada, y ahora sólo mantenemos una versión "actual" de los documentos. Así que, cualquier cosa en esta página que
hable de crear una nueva versión, actualizar versiones antiguas, etc., puede ser ignorada.

~~Sin embargo, la documentación de la Plataforma Anchor _todavía_ permanece en su propia instancia de docusaurus. Por lo tanto, la información aquí sobre enlazar dentro y entre instancias sigue siendo relevante. (Esto no será así para siempre, pero por ahora, sí lo es.)~~

¡Ya no es una instancia separada del plugin! Actualizaré este documento pronto, pero por ahora los detalles del enlace se pueden resumir en:

- casi siempre `[usa un](../../relative/link.mdx)` con la extensión del archivo,
  a menos que estés enlazando desde/hacia un documento de notas de reunión.

## Resumen Rápido (TL;DR)

- Para las versiones _no lanzadas_ de Anchor Platform:
  - Agrega y edita documentos en `/platforms/anchor-platform`
  - Actualiza y regenera la documentación de la API en `/openapi/anchor-platform/main-*.yaml`
- Para las versiones _lanzadas_ de Anchor Platform:
  - Actualiza y cambia documentos en `/ap_versioned_docs`
  - Actualiza y regenera la documentación de la API en `/openapi/anchor-platform/versions/*.yaml`

Lanza una **nueva versión** usando el siguiente script de yarn:

```bash
# replace `3.0.0` with the needed version
VERSION=3.0.0 yarn ap:versions:new
```

> _Nota:_ Creo que el comando de yarn anterior actualmente es incompatible con Windows, aunque podría estar equivocado.

Regenera la documentación de la API para versiones **ya lanzadas** usando el siguiente script de yarn. Esto regenera la documentación de la API para **todas** las versiones lanzadas, así que deberías ser selectivo con los archivos que añades a tu commit.

```bash
yarn ap:versions:regen
```

## Tabla de Contenidos <!-- omit in toc -->

- [¡AVISO! AP HA SIDO DESVERSIONADO](#notice-ap-has-been-de-versioned)
- [Resumen Rápido (TL;DR)](#tldr)
- [Más sobre Docusaurus de lo que nunca quisiste saber](#more-about-docusaurus-than-you-ever-wanted-to-know)
  - [Nomenclatura de Versiones](#versions-nomenclature)
  - [Plugins](#plugins)
  - [Instancias](#instances)
  - [Enlaces](#links)
    - [Ejemplos](#examples)
- [Directorios que Debes Conocer](#directories-to-know)
  - [Directorios que Ya Conoces](#directories-you-already-know-about)
  - [Directorios Nuevos y Geniales](#new-shiny-directories)
- [Creación de Nuevas Versiones](#making-new-versions)
  - [Usa Docusaurus para "Etiquetar" una Nueva Versión](#use-docusaurus-to-tag-a-new-release)
  - [Configura el plugin OpenAPI](#configure-the-openapi-plugin)
    - [Copia los archivos de especificación OpenAPI (empaquetados) al directorio versionado](#copy-the-bundled-openapi-specfiles-to-the-versioned-directory)
    - [Añade configuración a la instancia del plugin OpenAPI](#add-configuration-to-the-openapi-plugin-instance)
- [Actualizar versiones antiguas](#updating-old-versions)
  - [Actualizar páginas de documentación](#update-documentation-pages)
  - [Actualizar especificación de API](#update-api-specification)

## Más sobre Docusaurus de lo que nunca quisiste saber

Sé que puede parecer un poco misterioso, pero aquí tienes algo de conocimiento y contexto para ayudarte a entender lo que viene.

### Nomenclatura de Versiones

Así es como Docusaurus define estos términos, por lo que usaré esta nomenclatura en este documento también.

- La **versión actual** se refiere a la versión de la documentación de AP contenida en el directorio `/platforms/anchor-platform`. Este conjunto de documentos está disponible en la URL `/platforms/anchor-platform/next`. Este es el conjunto de documentos "en construcción".

- La **última versión** se refiere al conjunto de documentos de AP más recientemente "lanzado". Estos se encuentran en `/ap_versioned_docs` (más sobre esto más adelante), y están disponibles en la URL `/platforms/anchor-platform`. Este es el conjunto "estable" de documentos.

### Plugins

Aquí intervienen dos plugins de Docusaurus:

1. `@docusaurus/plugin-content-docs` es la base de trabajo de Docusaurus. Se encarga del renderizado de markdown, enrutamiento, etc. Cuando piensas en actualizar `some-file.mdx`, este es el plugin que estás usando.
2. `docusaurus-plugin-openapi-docs` es el plugin que se usa para generar páginas MDX a partir de archivos de especificación OpenAPI. Este plugin es capaz de versionar por sí mismo, por lo que se debe tener cuidado y consideración en cuanto a su configuración.

Ambas configuraciones de plugins se han separado en un archivo `/config/anchorPlatform.config.ts`, para facilitar su gestión y reducir la complejidad del archivo principal `docusaurus.config.ts`.

### Instancias

Aquí las cosas se vuelven un poco más técnicas, pero te prometo que esta parte es útil de conocer. Ambos [plugins](#plugins) que mencioné antes son realmente sólo _instancias_ de esos dos plugins. De hecho, cada uno de esos plugins se usa en otras partes de nuestro sitio de documentación para Horizon, SDP, y la documentación "regular". _Generalmente_ no es importante tener en cuenta las diferentes instancias de plugins, pero sí es **muy relevante** cuando hablamos de enlaces. Así que...

### Enlaces

> [!ADVERTENCIA]
>
> Esta sección está desactualizada. Por ahora, ignorala en su mayoría.

La mayoría de las veces, **especialmente en documentos versionados**, es importante [enlazar a otros documentos usando rutas de archivo _relativas_](https://docusaurus.io/docs/versioning#link-docs-by-file-paths).
Esto permite que Docusaurus reescriba URLs cuando es necesario en tiempo de compilación.

¡Sin embargo, hay una **EXCEPCIÓN GRANDE**! Docusaurus sólo puede manejar estos enlaces cuando los archivos fuente y destino son procesados por la misma _instancia del plugin_.
Entonces, en términos prácticos:

- Si estás enlazando _desde_ y _hacia_ documentos MDX _dentro_ de la misma instancia del plugin de documentos, usa rutas de archivo _relativas_.
- Si estás enlazando _entre_ instancias de plugins, **debes** usar rutas de _URL_. Por convención, usamos rutas _absolutas_ para esto también, para hacer un poco más obvio cuándo está sucediendo este comportamiento.

#### Ejemplos

Esto debería ayudar a aclararlo un poco.

- Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/sep-guide/sep6/configuration.mdx` _hacia_ el documento MDX `/platforms/anchor-platform/api-reference/platform/rpc/methods/notify_amounts_updated.mdx`:
  - Estamos en la misma instancia del plugin `/platforms/anchor-platform`.
  - Usa una ruta de archivo **relativa**
  - Enlázalo `[algo así](../../api-reference/platform/rpc/methods/notify_amounts_updated.mdx)`
- Quiero enlazar _desde_ el documento MDX `/docs/learn/fundamentals/anchors.mdx` _hacia_ el documento MDX `/platforms/anchor-platform/admin-guide/getting-started.mdx`
  - Estamos "cruzando" entre las instancias del plugin `/docs` y `/platforms/anchor-platform`.
  - Usa una ruta de **URL absoluta**
  - Enlázalo `[algo así](/platforms/anchor-platform/admin-guide/getting-started)` (nota que no hay extensión `.mdx`)
- Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/README.mdx` _hacia_ el documento MDX `/docs/tools/developer-tools/wallets.mdx`
  - Estamos "cruzando" entre las instancias del plugin `/platforms/anchor-platform` y `/docs`.
  - Usa una ruta de **URL absoluta**
  - Enlázalo `[algo así](/docs/tools/developer-tools/wallets)` (nota que no hay extensión `.mdx`)
- ¡Comodín! Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/admin-guide/events/configuration.mdx` _hacia_ el documento MDX `/platforms/stellar-disbursement-platform/admin-guide/60-anchor-platform-integration-points.mdx`
  - Estamos "cruzando" entre las instancias del plugin `/platforms/anchor-platform` y `/platforms/stellar-disbursement-platform`.
  - Usa una ruta de **URL absoluta**
  - Enlázalo `[algo así](/platforms/stellar-disbursement-platform/admin-guide/anchor-platform-integration-points)` (nota que no hay extensión `.mdx`)

> _Nota:_ Reemplaza la instancia del plugin `/platforms/anchor-platform` con la instancia `/platforms/stellar-disbursement-platform` en los ejemplos anteriores, y todo funciona prácticamente igual.

Lee más sobre enlaces [aquí](https://docusaurus.io/docs/markdown-features/links) (especialmente hacia el final de la página).

## Directorios que Debes Conocer

Hay varios directorios que _todos_ alimentan el producto final que es nuestra documentación versionada de AP.

### Directorios que Ya Conoces

- `/platforms/anchor-platform`: Aquí es donde estás ahora, y tradicionalmente ha sido el lugar para modificar cualquier contenido markdown que se convierta en nuestras páginas de documentación de AP. No ha cambiado mucho aquí, excepto que requiere un cambio de mentalidad.
  **Toda la documentación y contenido ubicado aquí ahora debe considerarse la versión `actual` (en construcción) de los documentos de AP.** Así que, mientras construimos para `v3.x` (y más adelante), querrás actualizar _el contenido aquí_.
  Los lectores aún podrán _ver_ este contenido antes de que se "lance", pero se les informará que es la versión no lanzada.

  También hay un nuevo directorio aquí que debes conocer:

  - `/platforms/anchor-platform/assets`: Como es probable que las diversas imágenes, diagramas, etc., necesiten actualizarse o cambiarse de una versión a otra, estamos ubicando los activos relevantes en este directorio. Esto
    permite que también sean versionados. Si quieres actualizar un diagrama o imagen para un próximo lanzamiento, deberías hacerlo aquí.

- `/openapi/anchor-platform`: Este es probablemente el lugar con el que ya estás familiarizado. Los archivos han sido renombrados recientemente, pero en su mayoría querrás modificar `main-{platform,callbacks,custody}.yaml`, que luego será "empaquetado" más adelante en un solo archivo que contiene todo.
  **Los archivos en este directorio también deben considerarse la versión `actual` (en construcción) de los documentos de especificación de AP.** Así que, mientras construimos para `v3.x` (y más adelante), querrás actualizar _los archivos de especificación aquí_.

  También hay un nuevo directorio aquí que debes conocer:

  - `/openapi/anchor-platform/versions`: Este directorio almacena una copia de los archivos de especificación _empaquetados_ para cada versión que se lanza. El plugin que usamos para generar la documentación de la API a partir de estos archivos de especificación se configura para usar _estas_ especificaciones versionadas para toda la documentación que no sea la `actual`.

- `/openrpc/src/anchor-platform`: Recientemente, movimos la especificación RPC a este directorio para que pueda beneficiarse de los mismos procesos de construcción y verificaciones de validación que la especificación `stellar-rpc`. Al igual que con los otros directorios cubiertos hasta ahora, cualquier cambio en estos archivos debe considerarse parte de la versión `actual` (en construcción) de la documentación. No hay (¿todavía?) muchas herramientas o ergonomía para actualizar las versiones "antiguas" de estas especificaciones. La versión `actual` de la especificación se genera en `/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json`.
  Esto significa que _sí_ se incluye en el proceso de versionado, así que cualquier cambio en versiones "antiguas" probablemente sólo necesite hacerse en esos archivos de especificación versionados por ahora (más sobre eso en la siguiente sección).

### Directorios Nuevos y Geniales

- `/ap_versioned_sidebars`: Podemos pasar rápidamente por este. Cuando haces una nueva versión de la documentación, Docusaurus almacena una copia de la barra lateral en ese momento. Realmente no deberías molestarte con nada aquí.

- `/ap_versioned_docs`: Aquí es donde viven los conjuntos "lanzados" de la documentación de AP.
  Cada vez que se lanza una versión, _todo_ lo que está dentro del directorio `/platforms/anchor-platform` se copia en un subdirectorio aquí.
  Notarás que ya tenemos una versión `v2.8.4` aquí. Cuando lancemos `v3.x`, se colocará una
  _nueva_ copia de los archivos aquí. La copia `latest` (estable) de los documentos de AP se extrae desde este directorio. Si encuentras algo para corregir o actualizar en una versión lanzada de la documentación, tendrás que actualizarlo aquí.

## Creación de Nuevas Versiones

Como se señaló en el [Resumen Rápido (TL;DR)](#tldr), este proceso se automatiza con el script `VERSION=3.0.0 yarn ap:versions:new`. Sin embargo, esto es lo que sucede bajo el capó de ese script.

### Usa Docusaurus para "etiquetar" un nuevo lanzamiento

¡Es realmente bastante simple! Usa la CLI de Docusaurus para hacer un nuevo lanzamiento:

```bash
# `ap` is the ID of the AP `@docusaurus/plugin-content-docs` plugin instance
yarn docusaurus docs:version:ap 3.0.0
```

Esto crea una nueva copia de los documentos en `/ap_versioned_docs`, y funcionará correctamente para mostrar la nueva versión en el sitio. Cualquier cambio futuro en la versión 3.0.0 de los documentos debe hacerse dentro del directorio `/ap_versioned_docs`.

### Configura el plugin OpenAPI

También necesitaremos poder modificar/actualizar/regenerar la documentación de la API si surge la necesidad. Así que necesitaremos configurar adecuadamente la instancia de plugin `docusaurus-plugin-openapi-docs`.

#### Copia los archivos de especificación OpenAPI (empaquetados) al directorio versionado

Por el momento, es tan simple como copiar los archivos:

```bash
cp openapi/anchor-platform/bundled-platform.yaml openapi/anchor-platform/versions/platform-3.0.0.yaml
cp openapi/anchor-platform/bundled-callbacks.yaml openapi/anchor-platform/versions/callbacks-3.0.0.yaml
cp openapi/anchor-platform/bundled-custody.yaml openapi/anchor-platform/versions/custody-3.0.0.yaml
```

> Observa que estamos copiando el archivo _empaquetado_, no el archivo _principal_. Esto asegura que el archivo versionado contiene todo lo que necesita.

#### Añade configuración a la instancia del plugin OpenAPI

> _Nota:_ Estas partes `versions` de la configuración ahora se generan dinámicamente, usando una función `makeVersions()`, así que estos pasos manuales de configuración no deberían ser necesarios. _Puede que_ quieras avanzar o ajustar la cadena `anchorPlatformNextVersion` en el archivo de configuración cuando lances una nueva versión de la documentación.

Para poder usar el CLI del plugin para actualizar versiones ya lanzadas, tenemos que actualizar la configuración en `/config/anchorPlatform.config.ts`. Haz una nueva entrada en el objeto `versions` de cada archivo de especificación, y copia el formato de las entradas que ya existen. Para referencia, así es como se ve actualmente para el "servidor de la plataforma" en `v2.8.4`:

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

## Actualizar versiones antiguas

### Actualizar páginas de documentación

Supongamos que encuentro un error ortográfico en la documentación de la Guía del Administrador `v2.8.4`. Encuentra el archivo relevante en el directorio `/ap_versioned_docs/version-2.8.4`, corrígelo y haz commit. Las actualizaciones de contenido son bastante sencillas aquí.

> _Nota_: Dado que la especificación RPC se trata de manera similar a los documentos MDX, usa el mismo proceso para hacer actualizaciones en el archivo de especificación RPC. Para `v2.8.4`, está ubicado aquí: `/ap_versioned_docs/version-2.8.4/api-reference/platform/rpc/anchor-platform.openrpc.json`.

### Actualizar especificación de API

Esto es un poco más complejo, pero no mucho. Encuentra y cambia la(s) parte(s) relevante(s) del archivo de especificación `/openapi/anchor-platform/versions/{platform, callbacks,custody}-2.8.4.yaml`.

Luego, regenera las páginas MDX:

```bash
# `ap-apis` is the ID of the AP `docusaurus-plugin-openapi-docs` plugin instance
yarn docusaurus gen-api-docs:version -p ap-apis:2.8.4
```

> _Nota:_ Puedes usar un script de yarn para regenerar automáticamente la documentación de API para **todas** las versiones lanzadas: `yarn ap:versions:regen`. Esto regenera todas las versiones, así que querrás ser selectivo con los archivos que añades al commit.

Haz commit de los cambios y estarás listo para continuar.
