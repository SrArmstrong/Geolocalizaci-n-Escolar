# Manual Completo: Generar AAB en Android Studio y Publicar en Google Play Console

## Índice
1. [¿Qué es un AAB?](#qué-es-un-aab)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración Inicial del Proyecto](#configuración-inicial-del-proyecto)
4. [Generación del AAB en Android Studio](#generación-del-aab-en-android-studio)
5. [Trabajar con Google Play Console](#trabajar-con-google-play-console)
6. [Pruebas y Validación](#pruebas-y-validación)
7. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

---
2025.4.23
Año, nivel de actualización, número de compilación
## ¿Qué es un AAB?

El **Android App Bundle (AAB)** es el formato de publicación oficial de Google Play desde agosto de 2021. A diferencia del APK tradicional, el AAB permite:

- **Reducción del tamaño de descarga** (hasta 15% más pequeño)
- **Entregas optimizadas** según el dispositivo del usuario
- **Play Feature Delivery** para funcionalidades bajo demanda
- **Play Asset Delivery** para recursos grandes

Google Play genera APKs optimizados a partir del AAB para cada configuración de dispositivo.

---

## Requisitos Previos

### 1. Software Necesario
- Android Studio (versión actualizada recomendada)
- Java Development Kit (JDK) 11 o superior
- Una cuenta de desarrollador de Google Play ($25 USD pago único)

### 2. Archivos Requeridos
- **Keystore (almacén de claves)**: Archivo `.jks` o `.keystore` para firmar tu aplicación
- Si no tienes uno, lo crearemos en este manual

### 3. Información Necesaria
- Nombre del paquete de la aplicación (ej: com.tuempresa.tuapp)
- Versión de la app (versionCode y versionName)
- Credenciales del keystore (alias, contraseñas)

---

## Configuración Inicial del Proyecto

### Paso 1: Configurar build.gradle (Module: app)

Abre el archivo `build.gradle` (nivel de módulo) y verifica/configura:

```gradle
android {
    namespace 'com.tuempresa.tuapp'
    compileSdk 34

    defaultConfig {
        applicationId "com.tuempresa.tuapp"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    bundle {
        language {
            enableSplit = true
        }
        density {
            enableSplit = true
        }
        abi {
            enableSplit = true
        }
    }
}
```

**Puntos importantes:**
- `versionCode`: Número entero que debe incrementarse con cada nueva versión
- `versionName`: Versión legible para usuarios (ej: "1.0.0")
- `minifyEnabled`: Optimiza y ofusca el código
- `shrinkResources`: Elimina recursos no utilizados

### Paso 2: Configurar Permisos en AndroidManifest.xml

Revisa tu archivo `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tuempresa.tuapp">

    <!-- Permisos necesarios -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.TuApp">
        
        <!-- Tus Activities -->
        
    </application>
</manifest>
```

---

## Generación del AAB en Android Studio

### Paso 1: Crear un Keystore (Si no tienes uno)

**Desde Android Studio:**

1. Ve a `Build` → `Generate Signed Bundle / APK`
2. Selecciona `Android App Bundle`
3. Haz clic en `Next`
4. En "Key store path", haz clic en `Create new...`

**Completa el formulario:**
- **Key store path**: Elige ubicación (ej: `C:/Users/TuNombre/keystore/mi-app-key.jks`)
- **Password**: Crea una contraseña segura (guárdala en lugar seguro)
- **Confirm**: Repite la contraseña
- **Alias**: Nombre de la clave (ej: "mi-app-key")
- **Key password**: Puede ser la misma o diferente
- **Validity (years)**: 25 años mínimo (recomendado: 100)
- **Certificate**:
  - First and Last Name: Tu nombre o nombre de empresa
  - Organizational Unit: Departamento (opcional)
  - Organization: Nombre de empresa
  - City or Locality: Tu ciudad
  - State or Province: Tu estado/provincia
  - Country Code: Código de 2 letras (ej: MX, ES, AR)

5. Haz clic en `OK`

**⚠️ IMPORTANTE: Guarda el keystore y las contraseñas en un lugar seguro. Si lo pierdes, no podrás actualizar tu app.**

### Paso 2: Generar el AAB Firmado

1. Ve a `Build` → `Generate Signed Bundle / APK`
2. Selecciona `Android App Bundle`
3. Haz clic en `Next`

**Configurar Firma:**
- **Key store path**: Selecciona tu archivo `.jks`
- **Key store password**: Ingresa la contraseña del keystore
- **Key alias**: Selecciona el alias de tu clave
- **Key password**: Ingresa la contraseña de la clave
- ☑️ **Remember passwords**: Marca si quieres guardarlas (solo en tu equipo)

4. Haz clic en `Next`

**Seleccionar Destino y Variante:**
- **Destination Folder**: Elige dónde guardar el AAB (por defecto: `app/release/`)
- **Build Variants**: Selecciona `release`
- ☑️ **Export encrypted key**: Marca esto (opcional, útil para Google Play App Signing)

5. Haz clic en `Finish`

**Resultado:**
Android Studio compilará tu aplicación. Una vez completado:
- Aparecerá una notificación en la parte inferior derecha
- El archivo AAB estará en: `app/release/app-release.aab`
- Haz clic en `locate` para abrir la carpeta

### Paso 3: Verificar el AAB Generado

**Usando bundletool (opcional pero recomendado):**

1. Descarga bundletool: https://github.com/google/bundletool/releases
2. Verifica el contenido del AAB:

```bash
java -jar bundletool-all.jar validate --bundle=app-release.aab
```

3. Genera APKs de prueba:

```bash
java -jar bundletool-all.jar build-apks --bundle=app-release.aab --output=app.apks --ks=mi-app-key.jks --ks-key-alias=mi-app-key
```

---

## Trabajar con Google Play Console

### Paso 1: Configurar Google Play App Signing (Recomendado)

Google Play App Signing gestiona y protege tu clave de firma de aplicaciones.

**Primera vez:**

1. Ve a https://play.google.com/console
2. Inicia sesión con tu cuenta de desarrollador
3. Selecciona o crea una aplicación
4. Ve a `Configuración` → `Integridad de la app` → `Firma de aplicaciones`
5. **Acepta los términos** de Google Play App Signing
6. Sigue las instrucciones para subir tu clave

**Opciones:**
- **Opción A**: Dejar que Google cree y gestione la clave (más seguro)
- **Opción B**: Subir tu keystore existente (usa si ya tienes usuarios)

### Paso 2: Crear una Nueva Versión

**1. Navega a la sección de lanzamientos:**
- Panel de Google Play Console
- Selecciona tu aplicación
- Ve a `Producción` (o `Pruebas` para testing)

**2. Crear nueva versión:**
- Haz clic en `Crear nueva versión`

**3. Subir el AAB:**
- Arrastra y suelta `app-release.aab` o haz clic en `Cargar`
- Espera a que se procese (puede tardar unos minutos)

**4. Completar información de la versión:**

```
Nombre de la versión: 1.0.0 (o tu versión actual)
Código de versión: 1 (debe coincidir con versionCode en build.gradle)

Notas de la versión:
Escribe lo nuevo en esta versión en todos los idiomas relevantes.

Ejemplo:
- Primera versión pública
- Función de inicio de sesión
- Panel de usuario
```

**5. Configurar países/regiones:**
- Selecciona en qué países estará disponible tu app
- Puedes seleccionar todos o específicos

**6. Revisar y enviar:**
- Revisa toda la información
- Haz clic en `Guardar` y luego en `Revisar versión`
- Si todo está correcto, haz clic en `Iniciar lanzamiento`

### Paso 3: Completar la Ficha de Play Store (Primera Vez)

Antes de publicar, debes completar:

#### A. Detalles de la Aplicación
- Título de la app (máximo 50 caracteres)
- Descripción corta (máximo 80 caracteres)
- Descripción completa (máximo 4000 caracteres)

#### B. Recursos Gráficos
**Obligatorios:**
- Icono de aplicación: 512 x 512 px (PNG, 32 bits)
- Gráfico de características: 1024 x 500 px
- Capturas de pantalla:
  - Teléfono: Mínimo 2, máximo 8 (16:9 o 9:16 ratio)
  - Tablet: Mínimo 2 (recomendado)

**Opcional:**
- Video promocional de YouTube
- Imagen del banner de TV (si aplica)

#### C. Categorización
- Categoría de la aplicación
- Tipo de contenido
- Dirección de correo de contacto
- Política de privacidad (URL obligatoria)

#### D. Clasificación de Contenido
- Completa el cuestionario de clasificación
- Google asignará calificaciones según la región (PEGI, ESRB, etc.)

#### E. Precios y Distribución
- Gratis o de pago
- Países de distribución
- Contiene anuncios (sí/no)
- Compras dentro de la aplicación (sí/no)

### Paso 4: Enviar para Revisión

1. Una vez completado todo, haz clic en `Enviar para revisión`
2. Google revisará tu app (puede tardar de horas a días)
3. Recibirás un correo cuando sea aprobada o si hay problemas

**Estados posibles:**
- ✅ **Aprobada**: Tu app está publicada
- ⏳ **En revisión**: Google está revisando
- ❌ **Rechazada**: Revisa los motivos y corrige

---

## Pruebas y Validación

### Prueba Interna

**Antes de publicar en producción:**

1. Ve a `Pruebas` → `Prueba interna`
2. Crea una lista de testers (correos electrónicos)
3. Sube el AAB
4. Comparte el enlace de prueba con tus testers

**Ventajas:**
- Pruebas sin riesgo
- Actualizaciones inmediatas (sin revisión)
- Hasta 100 testers

### Prueba Cerrada

Para un grupo más amplio (hasta 2000 testers):

1. Ve a `Pruebas` → `Prueba cerrada`
2. Configura grupos de testers
3. Sube el AAB
4. Distribuye enlace de opt-in

### Prueba Abierta

Antes del lanzamiento completo:

1. Ve a `Pruebas` → `Prueba abierta`
2. Sube el AAB
3. Cualquiera puede unirse
4. Límite opcional de participantes

---

## Solución de Problemas Comunes

### Error: "App not signed with App Signing key"

**Causa**: Usaste una clave diferente a la registrada.

**Solución**:
- Asegúrate de usar el mismo keystore
- Verifica alias y contraseñas
- Si perdiste la clave, contacta soporte de Google

### Error: "Version code X has already been used"

**Causa**: Ya subiste un AAB con ese versionCode.

**Solución**:
1. Abre `build.gradle`
2. Incrementa `versionCode` (ej: de 1 a 2)
3. Actualiza `versionName` (ej: de "1.0" a "1.1")
4. Reconstruye el AAB

### Error: "This file is invalid or corrupt"

**Causas posibles**:
- Archivo dañado durante la transferencia
- AAB no firmado correctamente
- Problema en la compilación

**Solución**:
1. Regenera el AAB desde Android Studio
2. Verifica con bundletool: `java -jar bundletool-all.jar validate --bundle=app-release.aab`
3. Intenta subir de nuevo

### App rechazada por política de contenido

**Motivos comunes**:
- Permisos innecesarios solicitados
- Contenido inapropiado
- Falta de política de privacidad
- Problemas de seguridad

**Solución**:
1. Lee el correo de rechazo cuidadosamente
2. Corrige los problemas señalados
3. Actualiza versionCode
4. Vuelve a enviar

### El AAB es muy grande (>150MB)

**Soluciones**:
1. Usa Android App Bundle (ya lo haces)
2. Habilita código de ofuscación: `minifyEnabled true`
3. Reduce recursos: `shrinkResources true`
4. Usa WebP en lugar de PNG para imágenes
5. Considera Play Asset Delivery para recursos grandes

### Error al firmar: "Keystore was tampered with"

**Causa**: Contraseña incorrecta o keystore corrupto.

**Solución**:
- Verifica todas las contraseñas
- Si usas un respaldo, prueba con él
- En último caso, si perdiste las credenciales y es una app nueva, crea nuevo keystore y nueva aplicación en Play Console

---

## Checklist Final Antes de Publicar

**Configuración del Proyecto:**
- ☐ versionCode incrementado correctamente
- ☐ versionName actualizado
- ☐ minifyEnabled = true para release
- ☐ Permisos en AndroidManifest justificados
- ☐ Logs de debug eliminados del código

**Keystore:**
- ☐ Keystore guardado en lugar seguro
- ☐ Contraseñas documentadas y seguras
- ☐ Backup del keystore creado

**Google Play Console:**
- ☐ Información de la app completa
- ☐ Capturas de pantalla subidas (mínimo 2)
- ☐ Icono de 512x512 subido
- ☐ Gráfico de características subido
- ☐ Política de privacidad configurada
- ☐ Clasificación de contenido completada
- ☐ AAB subido y procesado correctamente
- ☐ Notas de la versión escritas

**Pruebas:**
- ☐ Prueba interna realizada
- ☐ Probado en múltiples dispositivos
- ☐ Funciones críticas verificadas
- ☐ No hay crashes conocidos

---

## Recursos Adicionales

**Documentación Oficial:**
- Android Developers: https://developer.android.com/guide/app-bundle
- Google Play Console: https://support.google.com/googleplay/android-developer
- Bundletool: https://github.com/google/bundletool

**Herramientas Útiles:**
- Android Studio: https://developer.android.com/studio
- Bundletool: Para probar AABs localmente
- Google Play Console: https://play.google.com/console

**Mejores Prácticas:**
- Mantén siempre un backup de tu keystore
- Incrementa versionCode en cada actualización
- Usa pruebas internas antes de producción
- Lee las políticas de Google Play regularmente
- Monitorea los reportes de crashes en Play Console

---

## Conclusión

Siguiendo este manual, deberías poder:
1. ✅ Generar correctamente archivos AAB desde Android Studio
2. ✅ Configurar y utilizar Google Play Console
3. ✅ Publicar y actualizar aplicaciones en Google Play Store
4. ✅ Resolver problemas comunes durante el proceso

Recuerda que Google actualiza regularmente sus políticas y herramientas, por lo que es recomendable mantenerse actualizado con la documentación oficial.

**¡Buena suerte con tu publicación en Google Play!**

---

*Manual creado en 2025 - Verifica siempre la documentación oficial para cambios recientes*
