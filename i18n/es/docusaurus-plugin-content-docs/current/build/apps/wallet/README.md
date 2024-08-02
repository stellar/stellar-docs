## Guía de contribución

¡Gracias por contribuir a la documentación de la Cartera Stellar! Para empezar,
por favor lee primero la guía [main README](../../../README.md.

Esta documentación es principalmente para el SDK de Wallet y se utiliza para integrar
con varios SEP.

El documento está estructurado para ser agnóstico de idioma, pero con los componentes
listados a continuación podemos añadir lógica específica del idioma al documento.

Generalmente, el texto debe ser aplicable a todos los lenguajes de programación soportados,
pero para diferencias el componente especial `<LanguageSpecific/>` puede ser usado (lea
más abajo)

### Componentes guía de cartera

#### Cabecera

Header es un archivo .mdx especial que debe incluirse en todas las páginas. Contiene:

- Botones de idioma
- Una guía general sobre el uso de estos botones
- Advertencia opcional para los idiomas en curso

En todas las páginas nuevas, el Header debe ser el primer elemento. Opcionalmente, proporciona una lista
de idiomas que funcionan en curso:

```mdxjs
<Header WIPLangs={["ts", "dart"]}/>
```

#### Botones de idioma

Este componente es parte del encabezado. Permite cambiar entre la programación
lenguajes. El idioma actual se almacena como una cookie.

#### Advertencia de cartera

Este componente pone una advertencia si el idioma está en progreso para esta sección.
Por favor, utiliza la propiedad `WIPLangs` para activarla para un idioma de la página.

#### Ejemplo de código de cartera

Se ha mejorado el componente `CodeExample`. It currently supports dynamic
switching between TypeScript, Kotlin and Flutter code snippets (depending on the
user selected language). It will also generate placeholder if code snippet is
missing. Aquí hay un ejemplo de cómo usarlo:

````mdxjs
<CodeExample>

```kotlin
// Ejemplo de Kotlin aquí
​```


```ts
// Ejemplo de TypeScript aquí
```

// Ejemplo de Flutter se reemplaza con un aviso autogenerado

</CodeExample>
````

Para ejemplos de código regulares (no Wallet SDK) por favor utilice el componente `CodeExample`
de vanilla.

#### Idioma específico

Este componente permite representar partes de la documentación basándose en el código seleccionado.
Para empezar, crea 2 archivos en el directorio `component`:

```md
// ./component/kt/hello.mdx Hello, Kotlin!
```

```md
// ./component/ts/hello.mdx Hola, TypeScript!
```

Luego, en el documento principal importar tanto archivos como componente LanguageSpecific :

```mdxjs
// main.mdx
import {LanguageSpecific} from "@site/src/components/LanguageSpecific";
import KtHello from "./component/kt/hello.mdx";
import TsHello from "./component/ts/hello.mdx";

<LanguageSpecific kt={<KtHello/>} ts={<TsHello/>} /
```

Cuando el usuario selecciona Kotlin, "Hola, Kotlin!" va a ser renderizado, cuando
TypeScript es seleccionado — "Hola, TypeScript!". Finalmente, para Flutter, nada
sería renderizado.
