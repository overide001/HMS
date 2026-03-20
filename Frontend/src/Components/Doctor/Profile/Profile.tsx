import {
    Avatar, Button, Divider, Modal, NumberInput, Select, TextInput, Textarea,
    Paper, Grid, Group, Stack, Text, Title, ThemeIcon, Badge, Loader
} from "@mantine/core";
import { DateInput } from '@mantine/dates';
import {
    IconEdit, IconMail, IconPhone, IconMapPin, IconStethoscope,
    IconBuildingHospital, IconClock, IconLicense, IconCalendarStats,
    IconFileText, IconCake, IconDeviceFloppy, IconX, IconUsers,
    IconAward, IconRefresh, IconId
} from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { doctorDepartments, doctorSpecializations } from "../../../Data/DropdownData";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { getDoctor, updateDoctor } from "../../../Service/DoctorProfileService";
import { formatDate } from "../../../Utility/DateUtitlity";
import { useForm } from "@mantine/form";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";

const Profile = () => {
    const user = useSelector((state: any) => state.user);
    const [opened, { open, close }] = useDisclosure(false);
    const [editMode, setEdit] = useState(false);
    const [profile, setProfile] = useState<any>({});
    const [fetchLoading, setFetchLoading] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const fetchProfile = () => {
        setFetchLoading(true);
        getDoctor(user.profileId)
            .then((data) => setProfile({ ...data }))
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
            licenseNo: '',
            specialization: '',
            department: '',
            totalExp: '',
        },
        validate: {
            dob: (value) => !value ? 'Date of Birth is required' : undefined,
            phone: (value) => !value ? 'Phone number is required' : undefined,
            address: (value) => !value ? 'Address is required' : undefined,
            licenseNo: (value) => !value ? 'License number is required' : undefined,
        },
    });

    const handleEdit = () => {
        form.setValues({ ...profile, dob: profile.dob ? new Date(profile.dob) : undefined });
        setEdit(true);
    };

    const handleSubmit = () => {
        const values = form.getValues();
        form.validate();
        if (!form.isValid()) return;
        updateDoctor({ ...profile, ...values })
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

    const calculateExperience = (years: number): string => {
        if (!years) return 'Not specified';
        if (years < 1) return 'Less than a year';
        return years === 1 ? '1 year' : `${years} years`;
    };

    const maskLicense = (license: string): string => {
        if (!license) return '';
        return license.length > 4 ? `••••••${license.slice(-5)}` : license;
    };

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
        <div className="md:p-10 p-5 max-w-4xl mx-auto relative">

            {/* Refresh button */}
            {!editMode && (
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
            )}

            {/* ── Header / Avatar ── */}
            <Group gap="lg" className="mb-8 group" wrap="nowrap">
                <div className="relative transition-transform duration-500 ease-out transform group-hover:scale-105">
                    <Avatar
                        variant="filled"
                        src="/avatar.png"
                        size={matches ? 100 : 120}
                        radius={120}
                        className="border-4 border-white shadow-lg group-hover:shadow-2xl transition-all duration-500"
                    />
                    <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    {editMode && (
                        <button
                            onClick={open}
                            className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                            <IconEdit size={14} />
                        </button>
                    )}
                    {!editMode && (
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-0 shadow-lg">
                            <IconEdit size={14} />
                        </div>
                    )}
                </div>

                <Stack gap={4} className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Text
                            size={matches ? "28px" : "40px"}
                            fw={700}
                            className="text-neutral-900 tracking-tight transition-all duration-500 ease-out group-hover:translate-x-3"
                            style={{ lineHeight: 1.2 }}
                        >
                            {user.name || 'Doctor Name'}
                        </Text>
                        {!editMode && profile.specialization && (
                            <Badge
                                color="blue"
                                variant="light"
                                size="lg"
                                className="transition-all duration-500 opacity-0 group-hover:opacity-100 shadow-md"
                            >
                                <Group gap={4}>
                                    <IconStethoscope size={14} />
                                    <span>{profile.specialization}</span>
                                </Group>
                            </Badge>
                        )}
                    </div>
                    <Group gap="xs" className="transition-all duration-500 delay-100 group-hover:translate-x-3">
                        <IconMail size={18} className="text-neutral-400 group-hover:text-blue-500 transition-colors duration-500" />
                        <Text size="md" c="dimmed" className="group-hover:text-neutral-700">
                            {user.email || 'doctor@hospital.com'}
                        </Text>
                    </Group>
                    {profile.licenseNo && (
                        <Group gap="xs" className="transition-all duration-500 delay-200 group-hover:translate-x-3">
                            <IconId size={18} className="text-neutral-400 group-hover:text-blue-500 transition-colors duration-500" />
                            <Text size="sm" c="dimmed" className="font-mono">
                                {maskLicense(profile.licenseNo)}
                            </Text>
                        </Group>
                    )}
                </Stack>
            </Group>

            <Divider my="xl" className="opacity-50" />

            <Stack gap="lg">

                {/* ── Professional Information ── */}
                <Group gap="xs" className="group">
                    <div className="w-1 h-8 bg-blue-500 rounded-full mr-1 transition-all duration-500 ease-out group-hover:h-10 group-hover:bg-blue-600" />
                    <Title order={3} className="text-neutral-800 tracking-wide uppercase transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:text-blue-600">
                        Professional Information
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
                            className="bg-gradient-to-br from-blue-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-blue-300"
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
                                className="bg-gradient-to-br from-blue-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-blue-300"
                                onMouseEnter={() => setHoveredCard('dob')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Date of Birth</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'dob' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'dob' ? 'scale-110' : ''}`}>
                                        <IconCake size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900">
                                        {formatDate(profile.dob) ?? 'Not specified'}
                                    </Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>

                    {/* License Number */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        {editMode ? (
                            <TextInput
                                {...form.getInputProps("licenseNo")}
                                label="License Number"
                                placeholder="Enter medical license number"
                                size="md"
                                radius="lg"
                                leftSection={<IconLicense size={18} />}
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-gradient-to-br from-blue-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-blue-300"
                                onMouseEnter={() => setHoveredCard('license')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">License Number</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'license' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'license' ? 'scale-110' : ''}`}>
                                        <IconLicense size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900 font-mono">
                                        {profile.licenseNo ? maskLicense(profile.licenseNo) : 'Not provided'}
                                    </Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>

                    {/* Specialization */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        {editMode ? (
                            <Select
                                {...form.getInputProps("specialization")}
                                label="Specialization"
                                placeholder="Select specialization"
                                data={doctorSpecializations}
                                size="md"
                                radius="lg"
                                leftSection={<IconStethoscope size={18} />}
                                searchable
                                clearable
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-gradient-to-br from-blue-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-blue-300"
                                onMouseEnter={() => setHoveredCard('specialization')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Specialization</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'specialization' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'specialization' ? 'scale-110' : ''}`}>
                                        <IconStethoscope size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900">{profile.specialization ?? 'Not specified'}</Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>

                    {/* Department */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        {editMode ? (
                            <Select
                                {...form.getInputProps("department")}
                                label="Department"
                                placeholder="Select department"
                                data={doctorDepartments}
                                size="md"
                                radius="lg"
                                leftSection={<IconBuildingHospital size={18} />}
                                searchable
                                clearable
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-gradient-to-br from-blue-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-blue-300"
                                onMouseEnter={() => setHoveredCard('department')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Department</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'department' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'department' ? 'scale-110' : ''}`}>
                                        <IconBuildingHospital size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900">{profile.department ?? 'Not specified'}</Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>

                    {/* Total Experience */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                        {editMode ? (
                            <NumberInput
                                {...form.getInputProps("totalExp")}
                                label="Total Experience"
                                placeholder="Years of experience"
                                maxLength={2}
                                max={50}
                                clampBehavior="strict"
                                hideControls
                                size="md"
                                radius="lg"
                                leftSection={<IconClock size={18} />}
                                suffix=" years"
                            />
                        ) : (
                            <Paper
                                p="md" radius="lg"
                                className="bg-gradient-to-br from-blue-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-blue-300"
                                onMouseEnter={() => setHoveredCard('exp')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Experience</Text>
                                <Group gap="xs">
                                    <ThemeIcon color="blue" variant={hoveredCard === 'exp' ? 'filled' : 'light'} size="sm"
                                        className={`transition-all duration-500 ${hoveredCard === 'exp' ? 'scale-110' : ''}`}>
                                        <IconClock size={16} />
                                    </ThemeIcon>
                                    <Text size="sm" className="text-neutral-900">
                                        {profile.totalExp ? calculateExperience(profile.totalExp) : 'Not specified'}
                                    </Text>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>
                </Grid>

                {/* ── Contact Information ── */}
                <Stack mt="lg">
                    <Group gap="xs" className="group">
                        <div className="w-1 h-8 bg-teal-500 rounded-full mr-1 transition-all duration-500 ease-out group-hover:h-10 group-hover:bg-teal-600" />
                        <Title order={3} className="text-neutral-800 tracking-wide uppercase transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:text-teal-600">
                            Contact Information
                        </Title>
                    </Group>

                    <Grid gutter="md">
                        {/* Phone */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
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
                                    className="bg-gradient-to-br from-teal-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-teal-300"
                                    onMouseEnter={() => setHoveredCard('phone')}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Phone</Text>
                                    <Group gap="xs">
                                        <ThemeIcon color="teal" variant={hoveredCard === 'phone' ? 'filled' : 'light'} size="sm"
                                            className={`transition-all duration-500 ${hoveredCard === 'phone' ? 'scale-110' : ''}`}>
                                            <IconPhone size={16} />
                                        </ThemeIcon>
                                        <Text size="sm" className="text-neutral-900">{profile.phone ?? 'Not provided'}</Text>
                                    </Group>
                                </Paper>
                            )}
                        </Grid.Col>

                        {/* Address */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            {editMode ? (
                                <TextInput
                                    {...form.getInputProps("address")}
                                    label="Clinic Address"
                                    placeholder="Enter clinic/hospital address"
                                    size="md"
                                    radius="lg"
                                    leftSection={<IconMapPin size={18} />}
                                />
                            ) : (
                                <Paper
                                    p="md" radius="lg"
                                    className="bg-gradient-to-br from-teal-50 to-white transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border border-transparent hover:border-teal-300"
                                    onMouseEnter={() => setHoveredCard('address')}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1">Clinic Address</Text>
                                    <Group gap="xs" wrap="nowrap" align="flex-start">
                                        <ThemeIcon color="teal" variant={hoveredCard === 'address' ? 'filled' : 'light'} size="sm"
                                            className={`transition-all duration-500 mt-0.5 ${hoveredCard === 'address' ? 'scale-110' : ''}`}>
                                            <IconMapPin size={16} />
                                        </ThemeIcon>
                                        <Text size="sm" className="text-neutral-900 break-words flex-1">
                                            {profile.address ?? 'Not provided'}
                                        </Text>
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
                            leftSection={<IconX size={18} />}
                            radius="lg"
                            className="border-2 transition-all duration-500 ease-out hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="md"
                            color="green"
                            onClick={handleSubmit}
                            leftSection={<IconDeviceFloppy size={18} />}
                            radius="lg"
                            className="transition-all duration-500 ease-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                        >
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <Button
                        size="md"
                        color="blue"
                        onClick={handleEdit}
                        leftSection={<IconEdit size={18} />}
                        radius="lg"
                        disabled={fetchLoading}
                        className="transition-all duration-500 ease-out hover:shadow-2xl hover:scale-110 hover:-translate-y-1"
                    >
                        Edit Profile
                    </Button>
                )}
            
            </Group>

            {!editMode && profile.dob && (
                <Text size="xs" c="dimmed" className="text-center mt-4">
                    Last updated: {new Date().toLocaleDateString()}
                </Text>
            )}

            {/* ── Upload Modal (placeholder, matching Script 4) ── */}
            <Modal
                centered
                opened={opened}
                onClose={close}
                title={<span className="text-xl font-medium">Upload Profile Picture</span>}
            >
                {/* DropzoneButton goes here if added later */}
            </Modal>
        </div>
    );
};

export default Profile;