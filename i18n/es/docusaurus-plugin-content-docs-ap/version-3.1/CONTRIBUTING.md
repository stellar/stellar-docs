---
draft: true
---

# Bienvenido a Anchor Platform Madness <!-- omit in toc -->

¡Hola y bienvenido al nuevo hogar versionado de la documentación de Anchor Platform!

Estamos muy contentos de tenerte aquí, y esperamos que este documento te ayude a entender cómo (y, lo más importante, _dónde_) hacer los cambios necesarios en nuestra documentación. Empecemos con un poco de vocabulario de Docusaurus, ¿te parece?

## Resumen

- Para las versiones _no publicadas_ de Anchor Platform:
  - Agrega y edite documentos en `/platforms/anchor-platform`
  - Actualiza y regenera la documentación de la API en `/openapi/anchor-platform/main-*.yaml`
- Para las versiones _publicadas_ de Anchor Platform:
  - Actualiza y cambia los documentos en `/ap_versioned_docs`
  - Actualiza y regenera la documentación de la API en `/openapi/anchor-platform/versions/*.yaml`

Lanza una **nueva versión** usando el siguiente script de yarn:

```bash
# replace `3.0.0` with the needed version
VERSION=3.0.0 yarn ap:versions:new
```

> _Nota:_ Creo que el comando de yarn anterior es actualmente incompatible con Windows, aunque podría estar equivocado.

Regenera la documentación de la API para las versiones **ya publicadas** usando el siguiente script de yarn. Esto regenera la documentación de la API para **todas** las versiones publicadas, así que puede que quieras ser prudente sobre qué archivos agregas a tu commit.

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
- [Directorios que Conocer](#directories-to-know)
  - [Directorios que ya Conoces](#directories-you-already-know-about)
  - [Nuevos y Brillantes Directorios](#new-shiny-directories)
- [Hacer Nuevas Versiones](#making-new-versions)
  - [Usar Docusaurus para "Etiquetar" una Nueva Versión](#use-docusaurus-to-tag-a-new-release)
  - [Configurar el plugin de OpenAPI](#configure-the-openapi-plugin)
    - [ copiar los archivos de especificación de OpenAPI (agrupados) en el Directorio Versionado](#copy-the-bundled-openapi-specfiles-to-the-versioned-directory)
    - [Agregar Configuración a la Instancia del Plugin de OpenAPI](#add-configuration-to-the-openapi-plugin-instance)
- [Actualizar Versiones Antiguas](#updating-old-versions)
  - [Actualizar Páginas de Documentación](#update-documentation-pages)
  - [Actualizar Especificación de API](#update-api-specification)

## Más sobre Docusaurus de lo que nunca quisiste saber

Sé que puede parecer un poco misterioso, pero aquí hay un poco de conocimiento y contexto para ayudar a tu comprensión de lo que viene.

### Nomenclatura de Versiones

Así es como Docusaurus define estos términos, así que eso es lo que usaré en este documento.

- La **versión actual** se refiere a la versión de la documentación de la API contenida en el directorio `/platforms/anchor-platform`. Este conjunto de documentos está disponible en la URL `/platforms/anchor-platform/next`. Este es el conjunto de documentos "en construcción".

- La **última versión** se refiere al conjunto de documentación de API más recientemente "publicada". Estas se encuentran en `/ap_versioned_docs` (más sobre eso más tarde), y están disponibles en la URL `/platforms/anchor-platform`. Este es el conjunto de documentos "estables".

### Plugins

Hay dos plugins de Docusaurus en juego aquí:

1. `@docusaurus/plugin-content-docs` es el caballo de batalla de Docusaurus. Maneja el renderizado de markdown, enrutamiento, etc. Cuando pienses en actualizar `some-file.mdx`, este es el plugin que estás usando.
2. `docusaurus-plugin-openapi-docs` es el plugin que se usa para generar páginas MDX a partir de los archivos de especificación de OpenAPI. Este plugin es capaz de versionar por sí mismo, aunque se deben tomar algunos cuidados y consideraciones respecto a su configuración.

Ambas configuraciones de plugins se han desglosado en un archivo `/config/anchorPlatform.config.ts`, para facilitar su gestión y despejar un poco el archivo principal `docusaurus.config.ts`.

### Instancias

Aquí es donde se pone un poco más "en detalle", pero prometo que esta parte es útil para saber. Ambos [plugins](#plugins) que mencioné anteriormente son realmente _instancias_ de esos dos plugins. De hecho, cada uno de esos plugins se usa en nuestro sitio de documentación para Horizon, SDP, y simplemente para la documentación "regular". No es _generalmente_ importante considerar diferentes instancias de plugins, pero es _muy relevante_ cuando hablamos de enlaces. Entonces...

### Enlaces

La mayoría de las veces, **especialmente en documentos versionados**, es importante [enlazar a otros documentos mediante _rutas de archivos relativas_](https://docusaurus.io/docs/versioning#link-docs-by-file-paths).
Esto permite a Docusaurus reescribir URLs cuando sea necesario en el tiempo de construcción.

Sin embargo, ¡hay una **GRAN EXCEPCIÓN**! Docusaurus solo puede manejar estos enlaces cuando los archivos de origen y destino son procesados por la misma _instancia de plugin_.
Así que, en términos prácticos:

- Si estás enlazando de **y** a documentos MDX _dentro_ de la misma instancia de plugin de documentación, usa _rutas de archivos relativas_.
- Si estás enlazando _entre_ instancias de plugins, **debes** usar _rutas URL_. Por convención, también usamos _rutas absolutas_ para esto, para hacerlo un poco más obvio cuando este comportamiento está ocurriendo.

#### Ejemplos

Esto debería ayudar a aclarar un poco las cosas.

- Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/admin-guide/sep6/configuration.mdx` _hacia_ el documento MDX `/platforms/anchor-platform/api-reference/platform/rpc/methods/notify_amounts_updated.mdx`:
  - Estamos en la misma instancia del plugin `/platforms/anchor-platform`
  - Usa una **ruta de archivo relativa**
  - Enlaza con esto `[algo como esto](../../api-reference/platform/rpc/methods/notify_amounts_updated.mdx)`
- Quiero enlazar _desde_ el documento MDX `/docs/learn/fundamentals/anchors.mdx` _hacia_ el documento MDX `/platforms/anchor-platform/admin-guide/getting-started.mdx`
  - Estamos "cruzando" entre las instancias de plugin `/docs` y `/platforms/anchor-platform`
  - Usa una **ruta URL absoluta**
  - Enlaza con esto `[algo como esto](/platforms/anchor-platform/admin-guide/getting-started)` (ten en cuenta que no hay extensión `.mdx`)
- Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/custody/README.mdx` _hacia_ el documento MDX `/docs/tools/developer-tools/wallets.mdx`
  - Estamos "cruzando" entre las instancias de plugin `/platforms/anchor-platform` y `/docs`
  - Usa una **ruta URL absoluta**
  - Enlaza con esto `[algo como esto](/docs/tools/developer-tools/wallets)` (ten en cuenta que no hay extensión `.mdx`)
- ¡Wildcard! Quiero enlazar _desde_ el documento MDX `/platforms/anchor-platform/admin-guide/custody-services/configuration.mdx` _hacia_ el documento MDX `/platforms/stellar-disbursement-platform/admin-guide/60-anchor-platform-integration-points.mdx`
  - Estamos "cruzando" entre las instancias de plugin `/platforms/anchor-platform` y `/platforms/stellar-disbursement-platform`
  - Usa una **ruta URL absoluta**
  - Enlaza con esto `[algo como esto](/platforms/stellar-disbursement-platform/admin-guide/anchor-platform-integration-points)` (ten en cuenta que no hay extensión `.mdx`)

> _Nota:_ Reemplaza la instancia del plugin `/platforms/anchor-platform` con la instancia del plugin `/platforms/stellar-disbursement-platform` en los ejemplos anteriores, y todo funcionará de manera bastante similar.

Lee más sobre los enlaces [aquí](https://docusaurus.io/docs/markdown-features/links) (especialmente hacia el final de la página).

## Directorios que Conocer

Hay varias directorios que _todos_ contribuyen al producto final que es nuestra documentación de AP versionada.

### Directorios que ya Conoces

- `/platforms/anchor-platform` Este es el lugar donde estás ahora, y tradicionalmente ha sido el lugar para modificar cualquier contenido markdown que se convierte en nuestras páginas de documentación de AP. No ha cambiado mucho aquí, excepto que requiere un cambio de mentalidad.
  **Toda la documentación y contenido ubicados aquí ahora deben ser considerados la versión `actual` (en construcción) de la documentación de AP.** Así que, mientras estamos construyendo para `v3.x` (y más allá, finalmente), querrás estar actualizando _el contenido aquí_.
  Los lectores todavía podrán _ver_ este contenido antes de que se 'publique', pero se les dirá que es la versión no publicada.

  También hay un nuevo directorio aquí que deberías conocer:

  - `/platforms/anchor-platform/assets` Dado que es probable que las diversas imágenes, diagramas, etc. necesiten actualizarse/cambiarse de una versión a otra, estamos co-localizando los activos relevantes en este directorio. Esto permite que también sean versionados. Si quieres actualizar un diagrama o imagen para una próxima versión, deberías hacerlo aquí.

- `/openapi/anchor-platform` Este es el mismo lugar con el que probablemente ya estás familiarizado. Los archivos han sido renombrados recientemente, pero en su mayoría quieres modificar `main-{platform,callbacks,custody}.yaml`, que luego será "agrupado" más tarde en el archivo agrupado que contiene todo en un solo archivo.
  **Los archivos en este directorio también deben ser considerados la versión `actual` (en construcción) de los documentos de especificación de AP.** Entonces, mientras estamos construyendo para `v3.x` (y más allá, finalmente), deberás estar actualizando _los archivos de especificación aquí_.

  También hay un nuevo directorio aquí que deberías conocer:

  - `/openapi/anchor-platform/versions` Este directorio almacena una copia de los archivos de especificación _agrupados_ para cada versión que ha sido publicada. El plugin que usamos para generar la documentación de la API para estos archivos de especificación está configurado para usar _estas_ especificaciones versionadas para toda la documentación que no es `actual`.

- `/openrpc/src/anchor-platform` Recientemente, movimos la especificación RPC a este directorio para que pueda beneficiarse de los mismos procesos de construcción y cheques de validación que la especificación `stellar-rpc`. Similar a los otros directorios cubiertos hasta ahora, cualquier cambio en estos archivos debe considerarse en la versión `actual` (en construcción) de la documentación. No hay
  (¿todavía?) una gran cantidad de herramientas o ergonomía en torno a la actualización de las "viejas"
  versiones de estas especificaciones. La versión `actual` de la especificación se genera en `/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json`.
  Esto significa que _se_ incluye en el proceso de versionado, así que cualquier cambio en las versiones "antiguas" probablemente solo necesite hacerse en esos archivos de especificación versionados por ahora (más sobre eso en la siguiente sección).

### Nuevos y Brillantes Directorios

- `/ap_versioned_sidebars` Podemos pasar bastante rápido por este. Cuando haces una nueva versión de la documentación, Docusaurus almacena una copia de la barra lateral en ese punto en el tiempo. Realmente no deberías molestarte con nada aquí.

- `/ap_versioned_docs` Aquí es donde viven los conjuntos "publicados" de la documentación de AP.
  Cada vez que una versión es lanzada, _todo_ dentro del directorio `/platforms/anchor-platform` se copia en un subdirectorio aquí.
  Notarás que ya tenemos una versión `v2.8.4` aquí. A medida que lanzamos la versión `v3.x`, una _nueva_ copia de los archivos se colocará aquí. La copia `más reciente` (estándar) de la documentación de AP se extrae de este directorio. Si te encuentras con algo que corregir o actualizar en una versión lanzada de la documentación, deberás actualizar aquí en consecuencia.

## Hacer Nuevas Versiones

Como se indicó en el [Resumen](#tldr), este proceso está automatizado con el script `VERSION=3.0.0 yarn ap:versions:new`. Sin embargo, esto es lo que sucede tras bambalinas de ese script.

### Usar Docusaurus para "Etiquetar" una Nueva Versión

¡Es en realidad bastante simple! Usa la CLI de Docusaurus para hacer un nuevo lanzamiento:

```bash
# `ap` is the ID of the AP `@docusaurus/plugin-content-docs` plugin instance
yarn docusaurus docs:version:ap 3.0.0
```

Esto hace una nueva copia de la documentación en `/ap_versioned_docs`, y funcionará bastante bien para mostrar la nueva versión en el sitio. Cualquier cambio futuro en la versión 3.0.0 de la documentación debe hacerse dentro del directorio `/ap_versioned_docs`.

### Configurar el plugin de OpenAPI

También querrás poder modificar/actualizar/regenerar la documentación de la API si surge la necesidad. Así que, necesitaremos configurar esa instancia de plugin `docusaurus-plugin-openapi-docs` en consecuencia.

#### Copia los Archivos de Especificación de OpenAPI (Agrupados) al Directorio Versionado

En este momento, es tan simple como copiar los archivos:

```bash
cp openapi/anchor-platform/bundled-platform.yaml openapi/anchor-platform/versions/platform-3.0.0.yaml
cp openapi/anchor-platform/bundled-callbacks.yaml openapi/anchor-platform/versions/callbacks-3.0.0.yaml
cp openapi/anchor-platform/bundled-custody.yaml openapi/anchor-platform/versions/custody-3.0.0.yaml
```

> Observa cómo estamos copiando el archivo _agrupado_, no el archivo _principal_. Esto asegura que el archivo versionado contenga todo lo que necesita.

#### Agregar Configuración a la Instancia del Plugin de OpenAPI

> _Nota_: Estas partes de `versiones` de la configuración ahora se generan dinámicamente, utilizando una función `makeVersions()`, por lo que estos pasos de configuración manual no deberían necesitar hacerse. Tal vez quieras avanzar/ajustar la cadena `anchorPlatformNextVersion` en el archivo de configuración, cuando lances una nueva versión de documentos, sin embargo.

Para poder utilizar el CLI del plugin para actualizar las versiones ya publicadas,
tenemos que actualizar la configuración en `/config/anchorPlatform.config.ts`. Crea
a una nueva entrada en cada uno de los objetos `versions` de los archivos de especificación y copia el formato
de las entradas que ya están allí. Para referencia, así es como se ve actualmente
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

## Actualizar versiones antiguas

### Actualizar páginas de documentación

Vamos a suponer que encuentro un error tipográfico en la documentación de la Guía del Administrador `v2.8.4`. Encuentra
el archivo relevante en el directorio `/ap_versioned_docs/version-2.8.4`, corrige y
haz commit. Las actualizaciones de contenido son bastante fáciles aquí.

> _Nota:_ Dado que la especificación de RPC se trata de manera similar a los documentos MDX, utiliza el
> mismo proceso para hacer actualizaciones al archivo de especificación RPC. Para `v2.8.4`, se encuentra
> aquí:
> `/ap_versioned_docs/version-2.8.4/api-reference/platform/rpc/anchor-platform.openrpc.json`

### Actualizar especificación API

Esto es un poco más complicado, pero no mucho. Encuentra y cambia la(s)
parte(s) relevante(s) del
`/openapi/anchor-platform/versions/{platform, callbacks,custody}-2.8.4.yaml`
del archivo de especificación.

Luego, regenera las páginas MDX:

```bash
# `ap-apis` is the ID of the AP `docusaurus-plugin-openapi-docs` plugin instance
yarn docusaurus gen-api-docs:version -p ap-apis:2.8.4
```

> _Nota:_ Puedes usar un script de yarn para regenerar automáticamente la documentación de API para
> **todas** las versiones publicadas: `yarn ap:versions:regen`. Esto realmente
> regenera todas las versiones, así que es posible que quieras ser selectivo sobre qué archivos
> agregar al commit.

Haz commit de los cambios, y ya estás listo para comenzar.
