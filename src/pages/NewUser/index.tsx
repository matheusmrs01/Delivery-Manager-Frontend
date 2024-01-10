import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'

import { 
    BaseInput,
    Container,
    ContainerButtons,
    FormContainer,
    BaseButton
} from "./styles";
import { useState } from 'react';

const ProfileFormValidationSchema = zod.object({
    name: zod.string().min(5, 'Informe o seu nome.'),
    phone: zod
      .string()
      .min(11, 'Informe o seu numero.')
      .max(11),
    user: zod.string(),
    password: zod.string().min(4, 'Informe a senha.'),
    pix: zod.string(),
    profileImage: zod.string(),
    location: zod.string()
  })

  
type ProfileFormData = zod.infer<typeof ProfileFormValidationSchema>

export function NewUser(){
    const [selectedType, setSelectedType] = useState('')
    const profileFormData = useForm<ProfileFormData>({
        resolver: zodResolver(ProfileFormValidationSchema),
        defaultValues: {
            name: '',
            phone: '',
            user: '',
            password: '',
            pix: '',
            profileImage: '',
            location: '',
        },
    })

    const { handleSubmit, watch, register } = profileFormData

    function handleSave(data: ProfileFormData) {
        console.log(data)
        // navigate('/dashboard')
    }

    const name = watch('name')
    const phone = watch('phone')
    const pix = watch('pix')
    const profileImage = watch('profileImage')
    const location = watch('location')
    const isSubmitDisabled = !name || !phone || !pix || !profileImage || !location || phone.length < 11

    return (
        <Container>
            <form onSubmit={handleSubmit(handleSave)} action="">

                <FormContainer>
                    
                    <label htmlFor="name">Nome:</label>
                    <BaseInput
                        type="text"
                        id="name"
                        placeholder="Informe o nome."
                        {...register('name')}
                    />

                    <label htmlFor="phone">Whatsapp:</label>
                    <BaseInput
                        type="text"
                        id="phone"
                        minLength="11"
                        maxlength="11"
                        placeholder="Informe o whatsapp."
                        {...register('phone')}
                    />

                    <label htmlFor="user">User:</label>
                    <BaseInput
                        type="text"
                        id="user"
                        placeholder="Informe o usuário."
                        {...register('user')}
                    />

                    <label htmlFor="password">Senha:</label>
                    <BaseInput
                        type="password"
                        id="password"
                        placeholder="Informe a senha."
                        {...register('password')}
                    />

                    <label htmlFor="pix">Pix:</label>
                    <BaseInput
                        type="text"
                        id="pix"
                        placeholder="Informe o pix."
                        {...register('pix')}
                    />

                    <label htmlFor="profileImage">Link da imagem de perfil:</label>
                    <BaseInput
                        type="text"
                        id="profileImage"
                        placeholder="Informe o link da imagem."
                        {...register('profileImage')}
                    />

                    <label htmlFor="location">Link do google maps:</label>
                    <BaseInput
                        type="text"
                        id="location"
                        placeholder="Informe o link da localização."
                        {...register('location')}
                    />

                    <label htmlFor="userType">Tipo de usuário:</label>
                    <select 
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                    >
                        <option value="shopkeeper">Lojista</option>
                        <option value="motoboy">Motoboy</option>
                        <option value="admin">Admin</option>
                    </select>   

                    <ContainerButtons>
                        <BaseButton disabled={isSubmitDisabled} type="submit">Criar novo usuário</BaseButton>
                    </ContainerButtons>
                </FormContainer>
            </form>
        </Container>
    )
}