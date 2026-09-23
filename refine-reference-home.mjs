import {readFile,writeFile} from 'node:fs/promises';
for(const [file,pairs] of [
 ['src/components/m3/primitives.tsx',[['Seu pr?ximo carro','Seu próximo carro'],['espera por voc?.','espera por você.']]],
 ['src/components/m3/home.tsx',[['Gente que entende<br/>a sua escolha.','Conheça a M3.'],['Conhe?a a M3.','Conheça a M3.'],['Seu próximo capítulo ao volante começa com uma conversa.','Seu próximo capítulo ao volante começa com uma conversa atenta aos detalhes e ao que faz sentido para você.']]],
 ['src/components/m3/footer.tsx',[['Seu próximo carro<br/>está mais perto.','Pronto para o próximo carro?']]],
 ['src/lib/dealership.ts',[['Conheça a equipe na sua visita','Foto ilustrativa · atendimento'],['Uma conversa sobre o seu próximo carro','Foto ilustrativa · consultoria'],['Foto ilustrativa ? atendimento','Foto ilustrativa · atendimento'],['Foto ilustrativa ? consultoria','Foto ilustrativa · consultoria']]],
]){let content=await readFile(file,'utf8');for(const [a,b] of pairs)content=content.replaceAll(a,b);await writeFile(file,content);}
