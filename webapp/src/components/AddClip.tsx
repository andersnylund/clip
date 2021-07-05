import Image from 'next/image'
import React, { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { addClip } from '../../../shared/clip'

const addClipSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
})

type FormFields = z.infer<typeof addClipSchema>

export const AddClip: FC = () => {
  const {
    handleSubmit,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })
  const { url } = watch()

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    addClip({ title: data.title, url: url ?? null }, reset)
  }

  const isClip = Boolean(url && url !== '')

  return (
    <form className="flex flex-col gap-2 items-center mt-8" method="POST" onSubmit={handleSubmit(onSubmit)}>
      <input
        aria-invalid={Boolean(errors.title)}
        className={`border rounded border-gray-300 focus:outline-none focus:border-gray-500 p-2 ${
          errors.title?.message ? 'bg-red-100' : ''
        }`}
        {...register('title', { required: 'Title is required' })}
        placeholder="Title"
      />
      {errors.title?.message && (
        <span role="alert" aria-label={errors.title.message} className="text-red-400 inline-block">
          {errors.title.message}
        </span>
      )}
      <input
        aria-invalid={Boolean(errors.url)}
        className={`border rounded border-gray-300 focus:outline-none focus:border-gray-500 p-2 ${
          errors.url?.message ? 'bg-red-100' : ''
        }`}
        {...register('url', {
          validate: (urlStr) => {
            if (urlStr !== '') {
              const result = addClipSchema.pick({ url: true }).safeParse({ url: urlStr })
              if (result.success) {
                return true
              } else {
                return result.error.flatten().fieldErrors['url'].join(', ')
              }
            }
            return true
          },
        })}
        placeholder="URL"
      />
      {errors.url?.message && (
        <span role="alert" aria-label={errors.url.message} className="text-red-400 inline-block">
          {errors.url.message}
        </span>
      )}
      <button className="flex justify-center items-center gap-2 p-2 hover:bg-gray-200 transition-colors rounded">
        <span>{isClip ? 'Add clip' : 'Add folder'}</span>
        <Image height={24} width={24} src="/clip.svg" alt="Clip" />
      </button>
    </form>
  )
}
