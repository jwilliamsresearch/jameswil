import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
const ff='C:/Users/lgajw1/jameswil/node_modules/ffmpeg-static/ffmpeg.exe';
const V='public/assets/work/anythingpoi', A='src/assets/work/anythingpoi';
mkdirSync(V,{recursive:true}); mkdirSync(A,{recursive:true});
const run=a=>execFileSync(ff,['-y','-v','error',...a],{stdio:'inherit'});
const mb=p=>(statSync(p).size/1048576).toFixed(2);
const E='scale=trunc(iw/2)*2:trunc(ih/2)*2';
for (const [src,base] of [['anythingpoi/output-sample-demo-map.gif','demo-map'],
                          ['anythingpoi/output-same-toronto-visoptions.gif','toronto']]) {
  run(['-i',src,'-movflags','+faststart','-pix_fmt','yuv420p','-vf',E,'-c:v','libx264','-crf','28','-preset','slow','-an',`${V}/${base}.mp4`]);
  run(['-i',src,'-vf',E,'-c:v','libvpx-vp9','-crf','38','-b:v','0','-row-mt','1','-an',`${V}/${base}.webm`]);
  run(['-i',src,'-vf',`${E},select=eq(n\,0)`,'-frames:v','1','-update','1',`${A}/${base}-poster.png`]);
  console.log(`${base}  gif ${mb(src)}MB -> mp4 ${mb(`${V}/${base}.mp4`)}MB  webm ${mb(`${V}/${base}.webm`)}MB`);
}
