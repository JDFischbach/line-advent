import os, shutil
import wave

for fname in os.listdir():
  num = fname[:-4].split("_")[0] 
  new_name = f"{num}.mp3"
  #shutil.move(fname, new_name)
  os.system(f"ffmpeg -i {fname} -af areverse {new_name}")
