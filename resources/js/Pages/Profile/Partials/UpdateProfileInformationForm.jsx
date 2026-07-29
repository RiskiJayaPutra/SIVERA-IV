import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from '@/Components/Modal';
import { getCroppedImg } from '@/Utils/cropImage';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            profile_photo: null,
        });

    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setIsCropModalOpen(true);
        }
    };

    const showCroppedImage = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                0
            );
            
            const url = URL.createObjectURL(croppedImageBlob);
            setPreviewUrl(url);
            
            // Simpan blob ke Inertia data
            setData('profile_photo', croppedImageBlob);
            setIsCropModalOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informasi Profil & Foto
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ubah informasi dasar akun Anda beserta foto profil. Foto wajib berformat JPG/PNG maksimal 10 MB.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                
                <div className="flex items-center gap-6">
                    <div className="shrink-0 relative">
                        {previewUrl || user.profile_photo_url ? (
                            <img src={previewUrl || user.profile_photo_url} alt="Profile" className="h-24 w-24 object-cover rounded-full shadow-md border-4 border-white" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center shadow-md border-4 border-white">
                                <i className="fa-solid fa-user text-3xl text-slate-400"></i>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <InputLabel htmlFor="profile_photo" value="Foto Profil" />
                        <input 
                            type="file" 
                            id="profile_photo"
                            accept="image/png, image/jpeg"
                            onChange={onFileChange}
                            className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-kai-blue/10 file:text-kai-blue hover:file:bg-kai-blue/20"
                        />
                        <InputError className="mt-2" message={errors.profile_photo} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>

            {/* Modal Cropper */}
            <Modal show={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Sesuaikan Foto Profil</h2>
                    
                    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden mb-6">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    
                    <div className="mb-6 px-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setIsCropModalOpen(false)} 
                            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        >
                            Batal
                        </button>
                        <button 
                            type="button" 
                            onClick={showCroppedImage} 
                            className="px-5 py-2.5 text-sm font-bold text-white bg-kai-blue hover:bg-kai-blueLight rounded-xl transition"
                        >
                            Terapkan Potongan
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
