# Guía para contribuir

¡Gracias por contribuir a la documentación de la billeteras Stellar! Para comenzar,
por favor primero lee la guía [README principal](../../../README.md).

Esta documentación es principalmente para el SDK de la billeteras y sus usos para integrarse
con varios SEPs.

El documento está estructurado para ser independiente del lenguaje, pero con los componentes
listados a continuación podemos agregar lógica específica para cada lenguaje dentro del documento.

Generalmente, el texto debe ser aplicable a todos los lenguajes de programación soportados,
pero para diferencias se puede usar el componente especial `<LanguageSpecific/>` (lee
más abajo)

## Componentes de la guía para billeteras

### Encabezado

El encabezado es un archivo .mdx especial que debe incluirse en todas las páginas. Contiene:

- Botones de idioma
- Una guía general sobre el uso de estos botones
- Advertencia opcional para idiomas en progreso

En todas las páginas nuevas, el encabezado debe ser el primer elemento. Opcionalmente, proporciona una lista
de idiomas que están en progreso:

```mdxjs
<Header WIPLangs={["ts", "dart"]}/>
```

### LanguageButtons

Este componente es parte del encabezado. Permite cambiar entre los
lenguajes de programación. El idioma actual se almacena como una cookie.

### WalletGuideWarn

Este componente muestra una advertencia si el idioma está en progreso para esta sección.
Por favor utiliza la propiedad `WIPLangs` para activarlo para un idioma en la página.

### WalletCodeExample

Este es un componente mejorado `CodeExample`. Actualmente soporta el cambio dinámico
entre fragmentos de código en TypeScript, Kotlin, Flutter y Swift (dependiendo
del lenguaje seleccionado por el usuario). También generará un marcador de posición si falta el fragmento
de código. Aquí hay un ejemplo de cómo usarlo:

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

Para ejemplos de código regular (no del SDK de billeteras) por favor usa el componente `CodeExample` normal.

### LanguageSpecific

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

Cuando el usuario selecciona Kotlin, se mostrará "Hello, Kotlin!", cuando se
selecciona TypeScript — "Hello, TypeScript!". Finalmente, para Flutter y Swift,
no se mostrará nada.
