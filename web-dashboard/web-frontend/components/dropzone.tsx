import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { NextPage } from 'next'

interface Props{
    setIsUploading: any,
    setPhotoUrl: any,
}

const uploadImage = (image:any, setIsUploading:any, setPhotoUrl:any) => {
    // e.preventDefault();
    setIsUploading(true);
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "p8tqscrr")
    data.append("cloud_name","de3s26dkf")
    fetch("  https://api.cloudinary.com/v1_1/de3s26dkf/image/upload",{
    method:"post",
    body: data
    })
    .then(resp => resp.json())
    .then(data => {
    console.log(data)
    setPhotoUrl(data.url)
    setIsUploading(false);
    alert("Image Uploaded")
    })
    .catch(err => console.log(err))
  }

const Dropzone:NextPage<Props> = ({setIsUploading, setPhotoUrl}) => {
    const onDrop = useCallback((acceptedFiles:any) => {
      uploadImage(acceptedFiles[0], setIsUploading, setPhotoUrl)
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
    return (
        <div className='outline-dashed outline-1 outline-offset-2 px-2 py-2 rounded-md outline-gray-600'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drop student image here..</p>
                }
            </div>
        </div>
    )
  }

  export default Dropzone
  