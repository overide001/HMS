import {
    Avatar, Button, Divider, Modal, Select, TagsInput, TextInput,
    NumberInput, Paper, Grid, Group, Stack, Text, Title,
    ThemeIcon, Badge, Alert, Loader
} from "@mantine/core";
import { DateInput } from '@mantine/dates';
import {
    IconEdit, IconMail, IconPhone, IconMapPin, IconId, IconDroplet,
    IconAlertCircle, IconHospital, IconFileText, IconCalendarCheck,
    IconReportMedical, IconPill, IconHistory, IconCake, IconDeviceFloppy,
    IconX, IconHeart, IconUser, IconCheck, IconRefresh
} from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { bloodGroup, bloodGroups } from "../../../Data/DropdownData";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { getPatient, updatePatient } from "../../../Service/PatientProfileService";
import { formatDate } from "../../../Utility/DateUtitlity";
import { useForm } from "@mantine/form";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";
import { arrayToCSV } from "../../../Utility/OtherUtility";
import { DropzoneButton } from "../../Utility/Dropzone/DropzoneButton";
import useProtectedImage from "../../Utility/Dropzone/useProtectedImage";

const Profile = () => {
    const user = useSelector((state: any) => state.user);
    const [opened, { open, close }] = useDisclosure(false);
    const [editMode, setEdit] = useState(false);
    const [profile, setProfile] = useState<any>({});
    const [fetchLoading, setFetchLoading] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const fetchProfile = () => {
        setFetchLoading(true);
        getPatient(user.profileId)
            .then((data) => {
                setProfile({
                    ...data,
                    allergies: data.allergies ? JSON.parse(data.allergies) : null,
                    chronicDisease: data.chronicDisease ? JSON.parse(data.chronicDisease) : null,
                });
            })
            .catch((error) => console.log(error))
            .finally(() => setFetchLoading(false));
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const form = useForm({
        initialValues: {
            dob: '',
            phone: '',
            address: '',
            aadharNo: '',
            profilePictureId: '',
            bloodGroup: '',
            allergies: [] as string[],
            chronicDisease: [] as string[],
        },
        validate: {
            dob: (value) => !value ? 'Date of Birth is required' : undefined,
            phone: (value) => !value ? 'Phone number is required' : undefined,
            address: (value) => !value ? 'Address is required' : undefined,
            aadharNo: (value) => !value ? 'Aadhar number is required' : undefined,
        },
    });

    const handleEdit = () => {
        form.setValues({
            ...profile,
            dob: profile.dob ? new Date(profile.dob) : undefined,
            chronicDisease: profile.chronicDisease ?? [],
            allergies: profile.allergies ?? [],
        });
        setEdit(true);
    };

    const handleSubmit = () => {
        const values = form.getValues();
        form.validate();
        if (!form.isValid()) return;
        updatePatient({
            ...profile,
            ...values,
            allergies: values.allergies ? JSON.stringify(values.allergies) : null,
            chronicDisease: values.chronicDisease ? JSON.stringify(values.chronicDisease) : null,
        })
            .then(() => {
                successNotification("Profile updated successfully");
                setProfile({ ...profile, ...values });
                setEdit(false);
            })
            .catch((error) => {
                errorNotification(error.response.data.errorMessage);
            });
    };

    const handleCancel = () => {
        setEdit(false);
        form.reset();
    };

    const calculateAge = (dob: string | Date) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const maskAadhar = (aadhar: string | number) => {
        if (!aadhar) return '';
        const cleaned = String(aadhar).replace(/\D/g, '');
        if (cleaned.length === 12) return `XXXX XXXX ${cleaned.slice(8)}`;
        return cleaned.length > 4 ? `****${cleaned.slice(-4)}` : cleaned;
    };

    const url = useProtectedImage(profile.profilePictureId);
    const matches = useMediaQuery('(max-width: 768px)');

    if (fetchLoading) {
        return (
            <div className="p-10 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
                <Stack align="center" gap="md">
                    <Loader size="lg" color="blue" />
                    <Text size="sm" c="dimmed">Loading profile data...</Text>
                </Stack>
            </div>
        );
    }

    return (
        <div className="md:p-10 p-5 max-w-4xl mx-auto">

            {/* ── Header / Avatar ── */}
            <Group gap="lg" className="mb-8 group" wrap="nowrap">
                <div className="relative transition-all duration-700 ease-out transform group-hover:scale-105">
                    <Avatar
                        src={url}
                        size={matches ? 100 : 120}
                        radius={120}
                        className="border-4 border-transparent group-hover:border-blue-500 transition-all duration-700 ease-out shadow-lg group-hover:shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-700 ease-out" />
                    {editMode && (
                        <button
                            onClick={open}
                            className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full transition-all duration-500 hover:bg-blue-600 shadow-md"
                        >
                            <IconEdit size={14} />
                        </button>
                    )}
                    {!editMode && (
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-0">
                            <IconEdit size={14} />
                        </div>
                    )}
                </div>

                <Stack gap={4} className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Text
                            size={matches ? "28px" : "40px"}
                            fw={700}
                            className="text-neutral-900 tracking-tight transition-all duration-700 ease-out group-hover:translate-x-3"
                            style={{ lineHeight: 1.2 }}
                        >
                            {user.name || 'User Name'}
                        </Text>
                        {!editMode && (
                            <Badge
                                color="green"
                                variant="light"
                                size="lg"
                                className="transition-all duration-500 opacity-0 group-hover:opacity-100"
                            >
                                <Group gap={4}>
                                    <IconUser size={14} />
                                    <span>Active</span>
                                </Group>
                            </Badge>
                        )}
                    </div>
                    <Group gap="xs" className="transition-all duration-700 ease-out delay-100 group-hover:translate-x-3">
                        <IconMail size={18} className="text-neutral-400 group-hover:text-blue-500 transition-colors duration-500" />
                        <Text size="md" c="dimmed" className="group-hover:text-neutral-700">
                            {user.email || 'email@example.com'}
                        </Text>
                    </Group>
                </Stack>
            </Group>

            <Divider my="xl" className="opacity-50 transition-all duration-500 hover:opacity-100" />

            <Stack gap="lg">

                {/* ── Personal Information ── */}
                <Group gap="xs" className="group">
                    <div className="w-1 h-8 bg-blue-500 rounded-full mr-1 transition-all duration-700 ease-out group-hover:h-10 group-hover:bg-blue-600" />
                    <Title order={3} className="text-neutral-800 tracking-wide uppercase transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:text-blue-600">
                        Personal Information
                    </Title>
                    {editMode && (
                        <Badge color="blue" variant="light" size="lg" className="ml-4 animate-pulse">
                            Editing Mode
                        </Badge>
                    )}
                </Group>

                <Grid gutter="md" className="mt-2">

                    {/* Email (read-only) */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        <Paper
                            p="md" radius="lg"
                            className="bg-neutral-50 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 hover:bg-white border border-transparent hover:border-blue-200"
                            onMouseEnter={() => setHoveredCard('email')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Email</Text>
                            <Group gap="xs" wrap="nowrap">
                                <ThemeIcon color="blue" variant={hoveredCard === 'email' ? 'filled' : 'light'} size="sm"
                                    className={`transition-all duration-500 ${hoveredCard === 'email' ? 'scale-110' : ''}`}>
                                    <IconMail size={16} />
                                </ThemeIcon>
                                <Text size="sm" className="text-neutral-900 truncate">{user.email || 'Not provided'}</Text>
                            </Group>
                        </Paper>
                    </Grid.Col>

                    {/* Date of Birth */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        {editMode ? (
                            <DateInput
                                {...form.getInputProps("dob")}
                                label="Date of Birth"
                                placeholder="Date of birth"
                                size="md"
                                radius="lg"
                                maxDate={new Date()}
                                leftSection={<IconCake size={18} />}
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-neutral-50 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 hover:bg-white border border-transparent hover:border-blue-200 cursor-pointer"
                                onMouseEnter={() => setHoveredCard('dob')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Date of Birth</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'dob' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'dob' ? 'scale-110' : ''}`}>
                                        <IconCake size={16} />
                                    </ThemeIcon>
                                    <Stack gap={0}>
                                        <Text size="sm" className="text-neutral-900">
                                            {profile.dob ? formatDate(profile.dob) : 'Not specified'}
                                        </Text>
                                        {profile.dob && (
                                            <Text size="xs" c="dimmed" className="flex items-center gap-1">
                                                <IconHeart size={12} />
                                                {calculateAge(profile.dob)} years old
                                            </Text>
                                        )}
                                    </Stack>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>

                    {/* Phone */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        {editMode ? (
                            <NumberInput
                                {...form.getInputProps("phone")}
                                label="Phone"
                                placeholder="Enter 10-digit phone number"
                                maxLength={10}
                                clampBehavior="strict"
                                hideControls
                                size="md"
                                radius="lg"
                                leftSection={<IconPhone size={18} />}
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-neutral-50 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 hover:bg-white border border-transparent hover:border-blue-200 cursor-pointer"
                                onMouseEnter={() => setHoveredCard('phone')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Phone</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'phone' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'phone' ? 'scale-110' : ''}`}>
                                        <IconPhone size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900">{profile.phone ?? 'Not provided'}</Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>

                    {/* Address */}
                    <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
                        {editMode ? (
                            <TextInput
                                {...form.getInputProps("address")}
                                label="Address"
                                placeholder="Enter full address"
                                size="md"
                                radius="lg"
                                leftSection={<IconMapPin size={18} />}
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-neutral-50 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 hover:bg-white border border-transparent hover:border-blue-200 cursor-pointer"
                                onMouseEnter={() => setHoveredCard('address')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Address</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'address' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'address' ? 'scale-110' : ''}`}>
                                        <IconMapPin size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900">{profile.address ?? 'Not provided'}</Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>

                    {/* Aadhar */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        {editMode ? (
                            <NumberInput
                                {...form.getInputProps("aadharNo")}
                                label="Aadhar Number"
                                placeholder="Enter 12-digit Aadhar number"
                                maxLength={12}
                                clampBehavior="strict"
                                hideControls
                                size="md"
                                radius="lg"
                                leftSection={<IconId size={18} />}
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-neutral-50 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 hover:bg-white border border-transparent hover:border-blue-200 cursor-pointer"
                                onMouseEnter={() => setHoveredCard('aadhar')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Aadhar Number</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'aadhar' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'aadhar' ? 'scale-110' : ''}`}>
                                        <IconId size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900 font-mono">
                                        {profile.aadharNo ? maskAadhar(profile.aadharNo) : 'Not provided'}
                                    </Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>
                </Grid>

                {/* ── Medical Information ── */}
                <Stack mt="lg">
                    <Group gap="xs" className="group">
                        <div className="w-1 h-8 bg-green-500 rounded-full mr-1 transition-all duration-700 ease-out group-hover:h-10 group-hover:bg-green-600" />
                        <Title order={3} className="text-neutral-800 tracking-wide uppercase transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:text-green-600">
                            Medical Information
                        </Title>
                    </Group>

                    <Grid gutter="md">

                        {/* Blood Group */}
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            {editMode ? (
                                <Select
                                    {...form.getInputProps("bloodGroup")}
                                    label="Blood Group"
                                    placeholder="Select blood group"
                                    data={bloodGroups}
                                    size="md"
                                    radius="lg"
                                    leftSection={<IconDroplet size={18} />}
                                    searchable
                                    clearable
                                />
                            ) : (
                                <Paper
                                    p="md" radius="lg"
                                    className="bg-gradient-to-br from-red-50 to-white transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-red-300 cursor-pointer"
                                    onMouseEnter={() => setHoveredCard('blood')}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Blood Group</Text>
                                    <Group gap="xs">
                                        <ThemeIcon color="red" variant={hoveredCard === 'blood' ? 'filled' : 'light'} size="sm"
                                            className={`transition-all duration-500 ${hoveredCard === 'blood' ? 'scale-110' : ''}`}>
                                            <IconDroplet size={16} />
                                        </ThemeIcon>
                                        <Text size="md" fw={600} c="red">
                                            {bloodGroup[profile.bloodGroup] ?? 'Not specified'}
                                        </Text>
                                    </Group>
                                </Paper>
                            )}
                        </Grid.Col>

                        {/* Allergies */}
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            {editMode ? (
                                <TagsInput
                                    {...form.getInputProps("allergies")}
                                    label="Allergies"
                                    placeholder="Type and press Enter"
                                    size="md"
                                    radius="lg"
                                    leftSection={<IconAlertCircle size={18} />}
                                />
                            ) : (
                                <Paper
                                    p="md" radius="lg"
                                    className="bg-gradient-to-br from-yellow-50 to-white transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-yellow-300 cursor-pointer"
                                    onMouseEnter={() => setHoveredCard('allergies')}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Allergies</Text>
                                    <Group gap="xs">
                                        <ThemeIcon color="yellow" variant={hoveredCard === 'allergies' ? 'filled' : 'light'} size="sm"
                                            className={`transition-all duration-500 ${hoveredCard === 'allergies' ? 'scale-110' : ''}`}>
                                            <IconAlertCircle size={16} />
                                        </ThemeIcon>
                                        {profile.allergies?.length ? (
                                            <Group gap={4}>
                                                {profile.allergies.map((allergy: string, idx: number) => (
                                                    <Badge key={idx} color="yellow" size="lg" radius="xl"
                                                        className="transition-all duration-300 hover:scale-105">
                                                        {allergy.trim()}
                                                    </Badge>
                                                ))}
                                            </Group>
                                        ) : (
                                            <Text size="sm" className="text-neutral-900">No known allergies</Text>
                                        )}
                                    </Group>
                                </Paper>
                            )}
                        </Grid.Col>

                        {/* Chronic Diseases */}
                        <Grid.Col span={12}>
                            {editMode ? (
                                <TagsInput
                                    {...form.getInputProps("chronicDisease")}
                                    label="Chronic Diseases"
                                    placeholder="Type and press Enter"
                                    size="md"
                                    radius="lg"
                                    leftSection={<IconHospital size={18} />}
                                />
                            ) : (
                                <Paper
                                    p="md" radius="lg"
                                    className="bg-gradient-to-br from-purple-50 to-white transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-purple-300 cursor-pointer"
                                    onMouseEnter={() => setHoveredCard('diseases')}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Chronic Diseases</Text>
                                    <Group gap="xs">
                                        <ThemeIcon color="violet" variant={hoveredCard === 'diseases' ? 'filled' : 'light'} size="sm"
                                            className={`transition-all duration-500 ${hoveredCard === 'diseases' ? 'scale-110' : ''}`}>
                                            <IconHospital size={16} />
                                        </ThemeIcon>
                                        {profile.chronicDisease?.length ? (
                                            <Group gap={4}>
                                                {profile.chronicDisease.map((disease: string, idx: number) => (
                                                    <Badge key={idx} color="violet" size="lg" radius="xl"
                                                        className="transition-all duration-300 hover:scale-105">
                                                        {disease.trim()}
                                                    </Badge>
                                                ))}
                                            </Group>
                                        ) : (
                                            <Text size="sm" className="text-neutral-900">No chronic diseases reported</Text>
                                        )}
                                    </Group>
                                </Paper>
                            )}
                        </Grid.Col>
                    </Grid>
                </Stack>

                
            </Stack>

            {/* ── Action Buttons ── */}
            <Group justify="flex-end" mt="xl" gap="md">
                {editMode ? (
                    <>
                        <Button
                            size="md"
                            variant="outline"
                            color="red"
                            onClick={handleCancel}
                            className="border-2 transition-all duration-500 ease-out hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                            leftSection={<IconX size={18} />}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="md"
                            color="green"
                            onClick={handleSubmit}
                            className="transition-all duration-500 ease-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                            leftSection={<IconDeviceFloppy size={18} />}
                        >
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            size="md"
                            variant="subtle"
                            color="gray"
                            onClick={fetchProfile}
                            loading={fetchLoading}
                            className="transition-all duration-500 ease-out hover:shadow-md hover:scale-105 hover:-translate-y-1"
                            leftSection={<IconRefresh size={18} />}
                        >
                            Refresh
                        </Button>
                        <Button
                            size="md"
                            className="bg-neutral-800 text-white transition-all duration-700 ease-out hover:bg-blue-600 hover:shadow-2xl hover:scale-110 hover:-translate-y-1"
                            onClick={handleEdit}
                            leftSection={<IconEdit size={18} />}
                            disabled={fetchLoading}
                        >
                            Edit Profile
                        </Button>
                    </>
                )}
            </Group>

            {!editMode && profile.dob && (
                <Text size="xs" c="dimmed" className="text-center mt-4">
                    Last updated: {new Date().toLocaleDateString()}
                </Text>
            )}

            {/* ── Profile Picture Upload Modal ── */}
            <Modal
                centered
                opened={opened}
                onClose={close}
                title={<span className="text-xl font-medium">Upload Profile Picture</span>}
            >
                <DropzoneButton close={close} form={form} id="profilePictureId" />
            </Modal>
        </div>
    );
};

export default Profile;