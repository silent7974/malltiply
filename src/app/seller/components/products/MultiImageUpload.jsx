'use client'

import { useRef, useState } from 'react'
import { Trash2, VolumeX, Volume2, Maximize2 } from 'lucide-react'

export default function MultiImageUpload({
  productImages = [],
  onImagesChange,
  adVideo,
  onAdVideoAdd,
  onAdVideoRemove,
  maxImages = 5,
  allowVideo = false,
}) {
  const [mainIndex, setMainIndex] = useState(0)
  const [mode, setMode] = useState('images')
  const [showControls, setShowControls] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)

  const MAX_IMAGES = maxImages
  const fileInputRef = useRef(null)
  const fileInputMoreRef = useRef(null)
  const videoInputRef = useRef(null)
  const videoRef = useRef(null)

  const MIN_RESOLUTION = 400
  const MIN_VIDEO_HEIGHT = 720
  const MAX_VIDEO_DURATION = 30

  /* ---------------- helpers ---------------- */
  function openFileDialog(ref) {
    if (!ref?.current) return
    ref.current.value = null
    ref.current.click()
  }

  function isDuplicate(file) {
    return productImages.some(
      img => img.file && img.file.name === file.name && img.file.size === file.size
    )
  }

  async function validateImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        if (img.width < MIN_RESOLUTION || img.height < MIN_RESOLUTION) {
          reject(`Image must be at least ${MIN_RESOLUTION}×${MIN_RESOLUTION}`)
        } else {
          resolve()
        }
      }
    })
  }

  /* ---------------- image upload ---------------- */
  async function handleFilesSelected(e, isAdding) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const base = isAdding ? [...productImages] : []

    if (base.length + files.length > MAX_IMAGES) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images`)
      return
    }

    const valid = []
    for (const file of files) {
      if (isDuplicate(file)) {
        alert(`Duplicate image skipped: ${file.name}`)
        continue
      }
      try {
        await validateImage(file)
        valid.push({ file, url: URL.createObjectURL(file) })
      } catch (err) {
        alert(err)
      }
    }

    if (valid.length) onImagesChange([...base, ...valid])
  }

  function deleteImage(idx) {
    onImagesChange(productImages.filter((_, i) => i !== idx))
    if (mainIndex === idx && idx > 0) setMainIndex(idx - 1)
  }

  /* ---------------- video upload ---------------- */
  function handleVideoSelected(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url

    video.onloadedmetadata = () => {
      if (video.duration > MAX_VIDEO_DURATION) {
        alert(`Video must not exceed ${MAX_VIDEO_DURATION} seconds.`)
        return
      }
      if (video.videoHeight < MIN_VIDEO_HEIGHT) {
        alert('Video resolution below 720p. Not recommended.')
      }
      onAdVideoAdd({
        file,
        previewUrl: url,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })
    }
  }

  function toggleMute() {
    if (videoRef.current) videoRef.current.muted = !videoMuted
    setVideoMuted(v => !v)
  }

  function enterFullscreen() {
    videoRef.current?.requestFullscreen?.()
  }

  /* ---------------- render ---------------- */
  return (
    <div className="flex my-[24px] flex-col items-center">
      {/* Mode buttons */}
      {allowVideo && (
        <div className="flex gap-4 justify-center mb-4">
          <button
            onClick={() => setMode('images')}
            className={`px-4 py-2 rounded font-inter ${
              mode === 'images' ? 'bg-[#005770] text-white' : 'bg-[#eee] text-black'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setMode('video')}
            className={`px-4 py-2 rounded font-inter ${
              mode === 'video' ? 'bg-[#005770] text-white' : 'bg-[#eee] text-black'
            }`}
          >
            Ad
          </button>
        </div>
      )}

      {/* VIDEO MODE */}
      {mode === 'video' && allowVideo && (
        adVideo ? (
          <div
            className="relative w-[216px] h-[227px] rounded-[16px] overflow-hidden cursor-pointer"
            onClick={() => setShowControls(v => !v)}
          >
            <video
              ref={videoRef}
              src={adVideo.previewUrl || adVideo.url}
              autoPlay
              loop
              muted={videoMuted}
              className="w-full h-full object-cover"
            />
            {showControls && (
              <div className="absolute inset-0 px-[16px] py-[12px] flex flex-col justify-between">
                <div className="flex justify-between">
                  <button
                    onClick={enterFullscreen}
                    className="w-10 h-10 bg-black/80 rounded-full flex items-center justify-center"
                  >
                    <Maximize2 size={18} color="#fff" />
                  </button>
                  <button
                    onClick={onAdVideoRemove}
                    className="w-10 h-10 bg-black/80 rounded-full flex items-center justify-center"
                  >
                    <Trash2 size={18} color="#fff" />
                  </button>
                </div>
                <div className="absolute bottom-[12px] left-[16px]">
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 bg-black/80 rounded-full flex items-center justify-center"
                  >
                    {videoMuted ? <VolumeX size={18} color="#fff" /> : <Volume2 size={18} color="#fff" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => openFileDialog(videoInputRef)}
            className="w-[216px] h-[227px] rounded-[16px] border border-dashed border-black/50 cursor-pointer flex flex-col items-center justify-center"
          >
            <img src="/upload-ad.svg" className="w-[104px]" />
            <p className="mt-2 text-[18px] font-inter text-black/50">Upload video</p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoSelected}
            />
          </div>
        )
      )}

      {/* IMAGE MODE */}
      {mode === 'images' && (
        <>
          {productImages.length === 0 ? (
            <div
              onClick={() => openFileDialog(fileInputRef)}
              className="w-[216px] h-[227px] rounded-[16px] border border-dashed border-black/50 cursor-pointer flex flex-col items-center justify-center"
            >
              <img src="/upload.svg" className="w-[104px]" />
              <p className="mt-2 text-[24px] font-inter text-black">Tap to upload</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleFilesSelected(e, false)}
              />
            </div>
          ) : (
            <>
              <div className="relative rounded-[16px]" style={{ width: '100%', maxWidth: '416px', height: '295px', padding: '4px' }}>
                <img src={productImages[mainIndex]?.url} className="w-full h-full object-cover rounded-[16px]" />
              </div>

              <div className="mt-4 w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-4">
                  {productImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setMainIndex(idx)}
                      className="relative cursor-pointer rounded-[2px] overflow-hidden flex-shrink-0"
                      style={{ width: '64px', height: '64px', padding: '4px', boxSizing: 'border-box' }}
                    >
                      <img src={img.url} className="w-full h-full object-cover rounded-[2px]" />
                      {idx === mainIndex && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteImage(idx) }}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[2px]"
                        >
                          <img src="/trashcan.svg" className="w-[48px]" />
                        </button>
                      )}
                    </div>
                  ))}
                  {productImages.length < MAX_IMAGES && (
                    <div
                      onClick={() => openFileDialog(fileInputMoreRef)}
                      className="flex-shrink-0 w-[64px] h-[64px] rounded-[4px] border border-dashed border-black cursor-pointer flex items-center justify-center"
                    >
                      <img src="/upload-more.svg" className="w-[32px]" />
                      <input
                        ref={fileInputMoreRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => handleFilesSelected(e, true)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Guide text */}
      <div className="mt-4 flex flex-col max-w-[300px] ">
        <p className="text-[12px] font-inter text-black">
          {mode === 'video' ? 'Max 30 seconds – MP4 recommended – minimum 720p recommended' : 'Minimum resolution must be 800x800'}
        </p>
        {!allowVideo ? (
          <p className="text-[12px] text-black/50 mt-1">
            Upgrade to a premium seller to upload video ad and more images
          </p>
        ) : (
          <p className="text-[12px] text-black/50 mt-1">
            Adding a short product ad helps buyers understand your product better
          </p>
        )}
      </div>
    </div>
  )
}