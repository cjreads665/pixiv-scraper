import fs from 'fs';
import axios from 'axios';
import path from 'path';

const downloadImages = async(url,filename) =>{
    try{
        console.log(url);
        
        const response = await axios.get(url,{
            method: 'GET',
            responseType: 'stream',
            headers:{
                Referer: 'https://www.pixiv.net/'
            }
        })

        const writer = fs.createWriteStream(filename)
        response.data.pipe(writer)
        return new Promise((resolve,reject)=>{
            writer.on('finish',resolve)
            writer.on('error',reject)
        })


    } catch(e){
        console.log(e);
    }
}

(async()=>{
    const imgUrlArray = JSON.parse(fs.readFileSync('imageUrls.json','utf-8'))
    console.log(imgUrlArray);
    
    const downloadFolder = "./downloaded_images"

    if(!fs.existsSync(downloadFolder)){
        fs.mkdirSync(downloadFolder)
    }

    for(let i=0;i<imgUrlArray.length;i++){
        const currentUrl = imgUrlArray[i]
        console.log(imgUrlArray.length);
        
        const filename = path.join(downloadFolder,`image_${i}.jpg`)
        console.log(`Downloading image from ${currentUrl} to ${filename}`);
        await downloadImages(currentUrl,filename)
    }

})()
