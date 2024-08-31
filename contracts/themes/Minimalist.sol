// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

import {SmartCodec} from "../utils/SmartCodec.sol";
import {IVisualEngine} from "../interfaces/IVisualEngine.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Minimalist is IVisualEngine, Ownable(msg.sender) {
    string public theme = "Minimalist";
    string public network;
    IERC20 public moodToken;

    constructor(string memory networkName) {
        network = networkName;
        moodToken = IERC20(0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9);
    }

    function generateVisual(
        uint256 tokenId,
        string[] memory emojis
    ) public pure returns (string memory) {
        string memory encodedMarkup = string(
            abi.encodePacked(
                '<!DOCTYPE html> <html lang=en> <head> <meta charset=UTF-8> <meta name=viewport content="width=device-width,initial-scale=1"> <style> * { margin: 0; padding: 0; } body { background: #000; width: 100vw; height: 100vh; overflow: hidden;} </style> </head> <body> <canvas></canvas>',
                SmartCodec.decode(
                    "PHNjcmlwdCB0eXBlPSJ4LXNoYWRlci92ZXJ0ZXgtc2hhZGVyIiBpZD0idmVydGV4LXNoYWRlci1lbW9qaXMiPiN2ZXJzaW9uIDMwMCBlcwogICAgdW5pZm9ybSBmbG9hdCB1X3RpbWU7CiAgICB1bmlmb3JtIGZsb2F0IHVfc3BhY2luZzsKCiAgICBpbiB2ZWMyIGFfcG9zaXRpb247CiAgICBpbiB2ZWMyIGFfdGFyZ2V0UG9zaXRpb247CiAgICBpbiBmbG9hdCBhX3V2T2Zmc2V0WDsKICAgIGluIGZsb2F0IGFfdGltZTsKCiAgICBvdXQgZmxvYXQgdl91dk9mZnNldFg7CgogICAgdm9pZCBtYWluICgpIHsKICAgICAgICBmbG9hdCBjdXJyZW50VGltZSA9IG1vZCh1X3RpbWUgKyBhX3RpbWUsIDIuMCk7CiAgICAgICAgZmxvYXQgcmF0ZSA9IGNsYW1wKGN1cnJlbnRUaW1lIC8gMi4wLCAwLjAsIDEuMCk7CgogICAgICAgIHZlYzIgcG9zaXRpb24gPSBtaXgoYV9wb3NpdGlvbiwgYV90YXJnZXRQb3NpdGlvbiwgcmF0ZSk7CgogICAgICAgIGZsb2F0IGRpc3QgPSBkaXN0YW5jZShwb3NpdGlvbiwgdmVjMigwLjApKTsKCiAgICAgICAgcG9zaXRpb24ueCAvPSBzaW4oZGlzdCArIHJhdGUpICogdV9zcGFjaW5nOwogICAgICAgIHBvc2l0aW9uLnkgLz0gY29zKGRpc3QgKyByYXRlKSAqIHVfc3BhY2luZzsKCiAgICAgICAgcG9zaXRpb24gKz0gdmVjMihzaW4odV90aW1lKSwgY29zKHVfdGltZSkpICogMC4yOwoKICAgICAgICBnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAuMCwgMS4wKTsKICAgICAgICBnbF9Qb2ludFNpemUgPSByYXRlICogMTAwLjA7CgogICAgICAgIHZfdXZPZmZzZXRYID0gYV91dk9mZnNldFg7CiAgICB9Cgo8L3NjcmlwdD4="
                ),
                SmartCodec.decode(
                    "PHNjcmlwdCB0eXBlPSJ4LXNoYWRlci9mcmFnbWVudC1zaGFkZXIiIGlkPSJmcmFnbWVudC1zaGFkZXItZW1vamlzIj4jdmVyc2lvbiAzMDAgZXMKICAgIHByZWNpc2lvbiBoaWdocCBmbG9hdDsKCiAgICB1bmlmb3JtIHNhbXBsZXIyRCB1X2Vtb2ppVGV4OwogICAgdW5pZm9ybSBmbG9hdCB1X2Vtb2ppQ291bnQ7CiAgICAKICAgIGluIGZsb2F0IHZfdXZPZmZzZXRYOwoKICAgIG91dCB2ZWM0IGZpbmFsQ29sb3I7CgogICAgdm9pZCBtYWluICgpIHsKICAgICAgICB2ZWMyIHV2ID0gZ2xfUG9pbnRDb29yZDsKICAgICAgICB2ZWM0IHRleCA9IHRleHR1cmUodV9lbW9qaVRleCwgdXYgKiB2ZWMyKDEuMCAvIHVfZW1vamlDb3VudCwgMS4wKSArIHZlYzIodl91dk9mZnNldFgsIDAuMCkpOwogICAgICAgIGlmICh0ZXguYSA8IDAuNSkgZGlzY2FyZDsKICAgICAgICBmaW5hbENvbG9yID0gdGV4OwogICAgfQoKPC9zY3JpcHQ+"
                ),
                '<script type=module> const utils={makeWebGLInstance(e){const t=e.getContext("webgl2",{preserveDrawingBuffer:!0});if(!t){const e=document.createElement("div");return e.innerText="WebGL2.0 not supported. Please try modern Chrome or Firefox.",e.style.padding="2rem",e.style.background="#111",e.style.color="#fff",e.style.fontFamily="sans-serif",e.style.position="fixed",e.style.top=e.style.left="0px",e.style.width=e.style.height="100%",void document.body.appendChild(e)}return t},makeShader(e,t,i){const r=e.createShader(t);if(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))return r;console.error(`Error compiling shader: ${e.getShaderInfoLog(r)}`)},makeProgram(e,t,i){const r=e.createProgram();if(e.attachShader(r,t),e.attachShader(r,i),e.linkProgram(r),e.deleteShader(t),e.deleteShader(i),e.getProgramParameter(r,e.LINK_STATUS))return r;console.error(`Error linking program: ${e.getProgramInfoLog(r)}`)},makeBuffer(e,t){const{bufferType:i,typedArray:r,drawType:a}=t,o=e.createBuffer();return e.bindBuffer(i,o),e.bufferData(i,r,a),e.bindBuffer(i,null),o},bindBuffer(e,t,i){const{bufferType:r,attribLocation:a,attribType:o,itemsPerVert:s}=i;e.bindBuffer(r,t),t&&(e.enableVertexAttribArray(a),e.vertexAttribPointer(a,s,o,!1,0,0),e.bindBuffer(r,null))},makeVAO(e,t){const i={vao:e.createVertexArray(),buffers:[]};return e.bindVertexArray(i.vao),i.buffers=t.map((t=>{const i=this.makeBuffer(e,t);return t.bufferType!==e.ELEMENT_ARRAY_BUFFER&&this.bindBuffer(e,i,t),i})),e.bindVertexArray(null),i},makeTexture(e,t){const{width:i,height:r,image:a}=t,o=e.createTexture(),s=e.RGBA,n=e.RGBA,h=e.UNSIGNED_BYTE;return e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,s,n,h,a),e.bindTexture(e.TEXTURE_2D,null),o}};class EmojiTexture{constructor(e){const{emojis:t}=e;this.emojis=t,this.$canvas=document.createElement("canvas"),this.ctx=this.$canvas.getContext("2d"),this.cellWidth=48,this.cellHeight=48,this.$canvas.width=this.cellWidth*this.emojis.length,this.$canvas.height=this.cellHeight}getImage(){return this.emojis.forEach(((e,t)=>{const i=t*this.cellWidth+this.cellWidth/4,r=this.cellHeight/2+10;this.ctx.save(),this.ctx.translate(i,r),this.ctx.scale(3,3),this.ctx.fillText(e,0,0),this.ctx.restore()})),this.ctx.getImageData(0,0,this.$canvas.width,this.$canvas.height)}}class Particles{constructor(e,t){this.gl=e;const{count:i,emojisCount:r,vertexShaderSource:a,fragmentShaderSource:o,emojisTexture:s}=t;this.count=i,this.emojisTexture=s,this.spacing=1,this.targetSpacing=this.spacing,setInterval((()=>{this.targetSpacing=5*Math.random()}),5e3);const n=utils.makeShader(e,e.VERTEX_SHADER,a),h=utils.makeShader(e,e.FRAGMENT_SHADER,o);this.program=utils.makeProgram(e,n,h),this.uniformLocations={u_time:e.getUniformLocation(this.program,"u_time"),u_emojiTex:e.getUniformLocation(this.program,"u_emojiTex"),u_emojiCount:e.getUniformLocation(this.program,"u_emojiCount"),u_spacing:e.getUniformLocation(this.program,"u_spacing")},this.attribLocations={a_position:e.getAttribLocation(this.program,"a_position"),a_targetPosition:e.getAttribLocation(this.program,"a_targetPosition"),a_time:e.getAttribLocation(this.program,"a_time"),a_uvOffsetX:e.getAttribLocation(this.program,"a_uvOffsetX")},e.useProgram(this.program),e.uniform1i(this.uniformLocations.u_emojiTex,0),e.uniform1f(this.uniformLocations.u_emojiCount,r),e.useProgram(null);const m=new Float32Array(2*i),c=new Float32Array(2*i),g=new Float32Array(i),l=new Float32Array(i);for(let e=0;e<i;e+=1){const t=0,i=0;m[2*e+0]=t,m[2*e+1]=i,c[2*e+2]=5*(2*Math.random()-1),c[2*e+1]=5*(2*Math.random()-1),g[e]=2*Math.random(),l[e]=1/r*Math.floor(Math.random()*r)}const d=this.makeAttribs({vertices:m,targetPositions:c,times:g,uvOffsetsX:l});this.rtn=utils.makeVAO(e,d)}makeAttribs(e){const{vertices:t,targetPositions:i,times:r,uvOffsetsX:a}=e;return[{bufferType:gl.ARRAY_BUFFER,attribLocation:this.attribLocations.a_position,attribType:gl.FLOAT,itemsPerVert:4,typedArray:t,drawType:gl.STATIC_DRAW},{bufferType:gl.ARRAY_BUFFER,attribLocation:this.attribLocations.a_targetPosition,attribType:gl.FLOAT,itemsPerVert:4,typedArray:i,drawType:gl.STATIC_DRAW},{bufferType:gl.ARRAY_BUFFER,attribLocation:this.attribLocations.a_time,attribType:gl.FLOAT,itemsPerVert:2,typedArray:r,drawType:gl.STATIC_DRAW},{bufferType:gl.ARRAY_BUFFER,attribLocation:this.attribLocations.a_uvOffsetX,attribType:gl.FLOAT,itemsPerVert:2,typedArray:a,drawType:gl.STATIC_DRAW}]}renderFrame(e,t){this.spacing+=(this.targetSpacing-this.spacing)*t,this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,.2*e),this.gl.uniform1f(this.uniformLocations.u_spacing,this.spacing),this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.emojisTexture),this.gl.bindVertexArray(this.rtn.vao),this.gl.drawArrays(0,0,this.count),this.gl.bindTexture(this.gl.TEXTURE_2D,null),this.gl.bindVertexArray(null),this.gl.useProgram(null)}}let w=window.innerWidth,h=window.innerHeight,wdpr=w*(window.devicePixelRatio||1),hdpr=h*(window.devicePixelRatio||1),elapsedTime=0;const $canvas=document.getElementsByTagName("canvas")[0],gl=utils.makeWebGLInstance($canvas),emojis=',
                generateEmojis(emojis),
                ',emojisImage=new EmojiTexture({emojis:emojis}),emojisTexture=utils.makeTexture(gl,{width:emojisImage.$canvas.width,height:emojisImage.$canvas.height,image:emojisImage.getImage()}),particles=new Particles(gl,{count:15e3,emojisCount:emojis.length,vertexShaderSource:document.getElementById("vertex-shader-emojis").textContent,fragmentShaderSource:document.getElementById("fragment-shader-emojis").textContent,emojisTexture:emojisTexture});function init(){onResize(),window.requestAnimationFrame(onRenderFrame),window.onresize=onResize}function onRenderFrame(){window.requestAnimationFrame(onRenderFrame);const e=window.performance.now()/1e3,t=e-elapsedTime;elapsedTime=e,gl.viewport(0,0,wdpr,hdpr),',
                "gl.clear(gl.COLOR_BUFFER_BIT),particles.renderFrame(elapsedTime,t)}function onResize(){w=window.innerWidth,h=window.innerHeight,wdpr=w*(window.devicePixelRatio||1),hdpr=h*(window.devicePixelRatio||1),$canvas.width=wdpr,$canvas.height=hdpr,$canvas.style.width=`${w}px`,$canvas.style.height=`${h}px`}window.onload=init;</script> </body> </html>"
            )
        );
        string memory base64Document = string(
            abi.encodePacked(
                "data:text/html;base64,",
                SmartCodec.encode(bytes(encodedMarkup))
            )
        );
        return base64Document;
    }

    function generateImage(
        uint256,
        address,
        string[] memory emojis
    ) public pure returns (string memory) {
        require(emojis.length >= 3, "Must have at least one emoji");

        string memory emojiString = "";

        for (uint i = 0; i < emojis.length; i++) {
            emojiString = string.concat(
                emojiString,
                i == 0 ? "" : "",
                emojis[i]
            );
        }

        string memory svgImage = string(
            abi.encodePacked(
                '<svg width="800" height="800" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#ccc" fill-opacity=".01" d="M0 0h48v48H0z"/><text x="24" y="11" fill="#fff" style="text-anchor:middle;dominant-baseline:central;font-family:Arial,sans-serif;font-size:10px">',
                emojis[0],
                emojis[1],
                emojis[2],
                '</text><text x="24" y="24" fill="#ccc" style="text-anchor:middle;dominant-baseline:central;font-family:Arial,sans-serif;font-size:10px">',
                emojis[3],
                emojis[4],
                emojis[5],
                '</text><text x="24" y="37" fill="#ccc" style="text-anchor:middle;dominant-baseline:central;font-family:Arial,sans-serif;font-size:10px">',
                emojis[6],
                emojis[7],
                emojis[8],
                "</text></svg>"
            )
        );

        string memory base64Image = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                SmartCodec.encode(bytes(svgImage))
            )
        );

        return base64Image;
    }

    function generateMetadata(
        uint256 tokenId,
        address owner,
        string[] memory emojis,
        uint256 moodSwing
    ) public view returns (string memory) {
        // generate image
        string memory image = generateImage(tokenId, owner, emojis);
        // generate animation
        string memory animation = generateVisual(tokenId, emojis);
        // get mode
        string memory mode = theme;
        string memory externalUrl = string(
            abi.encodePacked(
                "https://degeneratives.art/id/",
                Strings.toString(tokenId),
                "?network=",
                network
            )
        );

        string memory metadata = string(
            abi.encodePacked(
                '{"name":"degeneratives.art #',
                Strings.toString(tokenId),
                unicode'","description":"[degenerative.art](',
                externalUrl,
                ') is a collection of unpredictable human expressions. each token is a reflection of its owner`s mood, visualized by onchain algorithms.", "image": "',
                image,
                '","animation_url": "',
                animation,
                '","external_url": "',
                externalUrl,
                '","attributes": [{"trait_type": "Impression", "value": "',
                emojis[0],
                '"},{"trait_type": "Vibe", "value": "',
                emojis[1],
                '"},{"trait_type": "Aura", "value": "',
                emojis[2],
                '"},{"trait_type": "Mood Swing", "value": "',
                Strings.toString(moodSwing),
                '"},{"trait_type": "Theme", "value": "',
                mode,
                '"}]}'
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    SmartCodec.encode(bytes(metadata))
                )
            );
    }

    function generateEmojis(
        string[] memory emojis
    ) public pure returns (string memory) {
        bytes memory result = "[";
        for (uint256 i = 0; i < emojis.length; i++) {
            result = abi.encodePacked(result, "'", (emojis[i]), "'");
            if (i < emojis.length - 1) {
                result = abi.encodePacked(result, ", ");
            }
        }
        result = abi.encodePacked(result, "]");
        return string(result);
    }

    function getPrice() external view returns (address, uint256) {
        return (address(moodToken), 0);
    }
}
