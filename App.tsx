// import { Camera } from 'expo-camera';
// import * as GL from 'expo-gl';
// import { GLView } from 'expo-gl';
// import React, { useRef, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   camera: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   buttons: {
//     flex: 1,
//     paddingHorizontal: 10,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     justifyContent: 'space-around',
//   },
//   button: {
//     flex: 1,
//     height: 40,
//     margin: 10,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// const vertShaderSource = `#version 300 es
// precision highp float;
// in vec2 position;
// out vec2 uv;
// void main() {
//   uv = position;
//   gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
// }`;

// const fragShaderSource = `#version 300 es
// precision highp float;
// uniform sampler2D cameraTexture;
// in vec2 uv;
// out vec4 fragColor;
// void main() {
//   fragColor = vec4(1.0 - texture(cameraTexture, uv).rgb, 1.0);
// }`;

// // See: https://github.com/expo/expo/pull/10229#discussion_r490961694
// const GLCameraScreen = () => {
//   const title = 'Expo.Camera integration';
//   const [zoom, setZoom] = useState(0);
//   const [type, setType] = useState(Camera.Constants.Type.front);

//   let refID = useRef<number>(0);
//   const camera = useRef<Camera | undefined>();
//   const glView = useRef<GL.GLView | undefined>();
//   let texture = useRef<WebGLTexture | undefined>();

//   // componentWillUnmount() {
//   //   if (this._rafID !== undefined) {
//   //     cancelAnimationFrame(this._rafID);
//   //   }
//   // }

//   const createCameraTexture = async () => {
//     const { status } = await Camera.requestPermissionsAsync();

//     if (status !== 'granted') {
//       throw new Error('Denied camera permissions!');
//     }

//     return glView!.createCameraTextureAsync(camera!);
//   };

//   const onContextCreate = async (gl: GL.ExpoWebGLRenderingContext) => {
//     // Create texture asynchronously
//     texture = await createCameraTexture();
//     const cameraTexture = texture;

//     // Compile vertex and fragment shaders
//     const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
//     gl.shaderSource(vertShader, vertShaderSource);
//     gl.compileShader(vertShader);

//     const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
//     gl.shaderSource(fragShader, fragShaderSource);
//     gl.compileShader(fragShader);

//     // Link, use program, save and enable attributes
//     const program = gl.createProgram()!;
//     gl.attachShader(program, vertShader);
//     gl.attachShader(program, fragShader);
//     gl.linkProgram(program);
//     gl.validateProgram(program);

//     gl.useProgram(program);

//     const positionAttrib = gl.getAttribLocation(program, 'position');
//     gl.enableVertexAttribArray(positionAttrib);

//     // Create, bind, fill buffer
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
//     gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

//     // Bind 'position' attribute
//     gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

//     // Set 'cameraTexture' uniform
//     gl.uniform1i(gl.getUniformLocation(program, 'cameraTexture'), 0);

//     // Activate unit 0
//     gl.activeTexture(gl.TEXTURE0);

//     // Render loop
//     const loop = () => {
//       refID = requestAnimationFrame(loop);

//       // Clear
//       gl.clearColor(0, 0, 1, 1);
//       // tslint:disable-next-line: no-bitwise
//       gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

//       // Bind texture if created
//       gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

//       // Draw!
//       gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

//       // Submit frame
//       gl.endFrameEXP();
//     };
//     loop();
//   };

//   const toggleFacing = () => {
//     const updateTypeCamera =
//       type === Camera.Constants.Type.front
//         ? Camera.Constants.Type.back
//         : Camera.Constants.Type.front;
//     setType(updateTypeCamera);
//   };

//   const zoomOut = () => {
//     const updateZoom = zoom - 0.1 < 0 ? 0 : zoom - 0.1;
//     setZoom(updateZoom);
//   };

//   const zoomIn = () => {
//     const updateZoom = zoom + 0.1 > 1 ? 1 : zoom + 0.1;
//     setZoom(updateZoom);
//   };

//   return (
//     <View style={styles.container}>
//       <Camera style={StyleSheet.absoluteFill} type={type} zoom={zoom} ref={camera} />
//       <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} ref={glView} />

//       <View style={styles.buttons}>
//         <TouchableOpacity style={styles.button} onPress={toggleFacing}>
//           <Text>Flip</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={zoomIn}>
//           <Text>Zoom in</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={zoomOut}>
//           <Text>Zoom out</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default GLCameraScreen;

import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Camera, FaceDetectionResult } from 'expo-camera';
import { WhiteBalance } from 'expo-camera/build/Camera.types';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 100,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  camera: {
    height: screenWidth,
    width: screenWidth,
  },
  footer: {
    width: '100%',
    position: 'relative',
    height: 56,
  },
  sectionWhiteBalance: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: '100%',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  btnFilter: {
    height: 56,
    minWidth: 56,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    margin: 8,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 8,
    paddingRight: 8,
  },
  btnFilterTitle: {
    color: '#000',
    lineHeight: 56,
    textAlign: 'center',
  },
  btnFlip: {
    marginTop: 16,
    width: 56,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
  },
  btnFlipTitle: {
    color: '#fff',
    lineHeight: 56,
    textAlign: 'center',
  },
  glcomp: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 100,
    backgroundColor: '#000',
  },
});

const vertShaderSource = `#version 300 es
precision highp float;
in vec2 position;
out vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
}`;

const fragShaderSource = `#version 300 es
precision highp float;
uniform sampler2D cameraTexture;
in vec2 uv;
out vec4 fragColor;
void main() {
  fragColor = vec4(1.0 - texture(cameraTexture, uv).rgb, 1.0);
}`;

const App = (): JSX.Element => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [whiteBalance, setWhiteBalance] = useState<number | keyof typeof WhiteBalance>('auto');

  let refID: number;
  let camera: Camera;
  let glView: GLView;
  let texture: WebGLTexture;

  const grantCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  };

  const changeWhiteBalance = (key: number | keyof typeof WhiteBalance) => {
    setWhiteBalance(key);
  };

  const createCameraTexture = async () => {
    const { status } = await Camera.requestPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Denied camera permissions!');
    }

    return glView.createCameraTextureAsync(camera);
  };

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    await grantCamera();
    // Create texture asynchronously
    texture = await createCameraTexture();

    const cameraTexture = texture;

    // Compile vertex and fragment shaders
    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, vertShaderSource);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, fragShaderSource);
    gl.compileShader(fragShader);

    // Link, use program, save and enable attributes
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    gl.useProgram(program);

    const positionAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttrib);

    // Create, bind, fill buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    // Bind 'position' attribute
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    // Set 'cameraTexture' uniform
    gl.uniform1i(gl.getUniformLocation(program, 'cameraTexture'), 0);

    // Activate unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Render loop
    const loop = () => {
      refID = requestAnimationFrame(loop);

      // Clear
      gl.clearColor(0, 0, 1, 1);
      // tslint:disable-next-line: no-bitwise
      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

      // Bind texture if created
      gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

      // Draw!
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

      // Submit frame
      gl.endFrameEXP();
    };
    loop();
  };

  useEffect(() => {
    grantCamera();
  }, []);

  if (hasPermission === false) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style={'auto' as StatusBarStyle} />
          <Text>No access to camera</Text>
          <Button onPress={grantCamera} title="Camera" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={'auto' as StatusBarStyle} />
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={type}
          autoFocus
          ratio="1:1"
          whiteBalance={whiteBalance}
          // onFacesDetected={(face: FaceDetectionResult) => {
          //   console.log(face);
          // }}
        />
        <GLView style={styles.glcomp} onContextCreate={onContextCreate} />
        <View>
          <Text>white balance: {whiteBalance}</Text>
        </View>
        <View>
          <View style={styles.sectionWhiteBalance}>
            <TouchableOpacity style={styles.btnFilter} onPress={() => changeWhiteBalance('auto')}>
              <Text style={styles.btnFilterTitle}>Auto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={() => changeWhiteBalance('cloudy')}>
              <Text style={styles.btnFilterTitle}>Cloudy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFilter}
              onPress={() => changeWhiteBalance('continuous')}
            >
              <Text style={styles.btnFilterTitle}>Continuous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFilter}
              onPress={() => changeWhiteBalance('fluorescent')}
            >
              <Text style={styles.btnFilterTitle}>Fluorescent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFilter}
              onPress={() => changeWhiteBalance('incandescent')}
            >
              <Text style={styles.btnFilterTitle}>Incandescent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={() => changeWhiteBalance('sunny')}>
              <Text style={styles.btnFilterTitle}>Sunny</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={() => changeWhiteBalance('shadow')}>
              <Text style={styles.btnFilterTitle}>Shadow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={() => changeWhiteBalance('manual')}>
              <Text style={styles.btnFilterTitle}>Manual</Text>
            </TouchableOpacity>
          </View>
          {/* <View>
            <TouchableOpacity style={styles.btnFlip} onPress={flipCamera}>
              <Text style={styles.btnFlipTitle}>Flip</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </SafeAreaProvider>
  );

  // return (
  //   <SafeAreaProvider>
  //     <StatusBar style={'auto' as StatusBarStyle} />
  //     <View style={styles.container}>
  //       <Text>Open up App.tsx to start working on your app!!!</Text>
  //     </View>
  //   </SafeAreaProvider>
  // );
};

export default App;
