'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageGallery({ images }: { images: string[] }) {
    const [selectedImage, setSelectedImage] = useState(images[0])

    return (
        <div className="bg-white p-4 flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-20 max-h-[560px] overflow-y-auto no-scrollbar">
                {images.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        alt={`thumbnail-${index}`}
                        width={80}
                        height={80}
                        onClick={() => setSelectedImage(image)}
                        className={`rounded-md cursor-pointer
              ${selectedImage === image ? 'opacity-50' : 'opacity-100'}`}
                    />
                ))}
            </div>

            {/* Foto utama */}
            <div className="flex-1">
                <Image
                    alt="img-main"
                    src={selectedImage}
                    className="w-full h-auto rounded-md"
                    width={500}
                    height={300}
                />
            </div>
        </div>
    )
}
