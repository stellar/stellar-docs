## Guía de Contribución

¡Gracias por contribuir a la documentación de la billetera Stellar! Para comenzar,
lee primero la guía [main README](../../../README.md).

Esta documentación es principalmente para el SDK de billetera y sus usos para integrar
con varios SEPs.

El documento está estructurado para ser independiente del lenguaje, pero con los componentes
enumerados a continuación podemos agregar lógica específica de idioma en el documento.

En general, el texto debe ser aplicable a todos los lenguajes de programación admitidos,
pero para las diferencias se puede usar el componente especial `<LanguageSpecific/>` (lee
más abajo)

### Componentes de guía de billetera

#### Encabezado

El encabezado es un archivo especial .mdx que debe incluirse en todas las páginas. Contiene:

- Botones de idioma
- Una guía general sobre cómo usar estos botones
- Advertencia opcional para lenguajes en progreso

En todas las nuevas páginas, el encabezado debe ser el primer elemento. Opcionalmente, proporciona una lista
de idiomas que están en progreso:

```mdxjs
<Header WIPLangs={["ts", "dart"]}/>
```

#### Botones de idioma

Este componente es parte del encabezado. Te permite cambiar entre lenguajes de programación. El idioma actual se almacena como una cookie.

#### Advertencia de guía de billetera

Este componente coloca una advertencia si el idioma está en progreso para esta sección.
Por favor usa la propiedad `WIPLangs` para habilitarlo para un idioma en la página.

#### Ejemplo de código de billetera

Este es un componente `CodeExample` mejorado. Actualmente admite el cambio dinámico entre fragmentos de código de TypeScript, Kotlin, Flutter y Swift (dependiendo del idioma seleccionado por el usuario). También generará un marcador de posición si falta un fragmento de código. Aquí hay un ejemplo de cómo usarlo:

````mdxjs
<CodeExample>

​```kotlin
// Kotlin example here
​```


​```ts
// TypeScript example here
​```

// Flutter example is replaced with an auto-generated notice

</CodeExample>
````

Para ejemplos de código regulares (no SDK de billetera), por favor usa el componente `CodeExample`.

#### Específico del idioma

Este componente permite renderizar partes de la documentación basadas en el código seleccionado.
Para comenzar, crea 2 archivos en el directorio `component`:

```md
// ./component/kt/hello.mdx Hello, Kotlin!
```

```md
// ./component/ts/hello.mdx Hello, TypeScript!
```

Luego, en el documento principal importa ambos archivos y el componente LanguageSpecific:

```mdxjs
// main.mdx
import {LanguageSpecific} from "@site/src/components/LanguageSpecific";
import KtHello from "./component/kt/hello.mdx";
import TsHello from "./component/ts/hello.mdx";

<LanguageSpecific kt={<KtHello/>} ts={<TsHello/>} /
```

Cuando el usuario selecciona Kotlin, "¡Hola, Kotlin!" se va a renderizar, cuando
se selecciona TypeScript — "¡Hola, TypeScript!". Finalmente, para Flutter y Swift, no se renderizará nada.
