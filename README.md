# Roteiro para funcionamento do "expo-location"

1. Instalar a biblioteca `npx expo install expo-location`.
2. Em `app.json` colocar o seguinte codigo (Funciona apenas com o android)

```json
"plugins": [
      [
        "expo-location",
        {
          "isAndroidBackgroundLocationEnabled": false
        }
      ]
    ]
```
