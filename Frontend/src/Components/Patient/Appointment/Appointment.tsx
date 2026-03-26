import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ActionIcon, Button, LoadingOverlay, Modal, SegmentedControl, Select, Text, Textarea, TextInput, Skeleton, Badge } from '@mantine/core';
import { IconLayoutGrid, IconPlus, IconSearch, IconTable, IconTrash } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { getDoctorDropdown } from '../../../Service/DoctorProfileService';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { appointmentReasons } from '../../../Data/DropdownData';
import { useSelector } from 'react-redux';
import { cancelAppointment, getAppointmentsByPatient, scheduleAppointment } from '../../../Service/AppointmentService';
import { errorNotification, successNotification } from '../../../Utility/NotificationUtil';
import { formatDateWithTime } from '../../../Utility/DateUtitlity';
import { modals } from '@mantine/modals';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { Toolbar } from 'primereact/toolbar';
import ApCard from './ApCard';

// Custom styles for PrimeReact DataTable
const customPrimeStyles = `
  .p-datatable {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    background: #ffffff;
    font-family: 'Outfit', sans-serif;
  }
  .p-datatable .p-datatable-thead > tr > th {
    background: #f8fafc;
    color: #1e293b;
    font-weight: 600;
    font-size: 0.875rem;
    padding: 1rem 1rem;
    border-bottom: 1px solid #e2e8f0;
  }
  .p-datatable .p-datatable-tbody > tr {
    transition: all 0.2s ease;
  }
  .p-datatable .p-datatable-tbody > tr:hover {
    background: #f1f5f9;
    transform: scale(1.002);
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .p-datatable .p-paginator {
    background: transparent;
    border-top: 1px solid #e2e8f0;
    padding: 1rem;
  }
  .p-datatable .p-paginator .p-paginator-element {
    border-radius: 12px;
    transition: all 0.2s;
  }
  .p-datatable .p-paginator .p-paginator-element.p-highlight {
    background: #3b82f6;
    color: white;
  }
  .p-datatable .p-column-filter-menu-button {
    color: #64748b;
  }
  .p-datatable .p-column-filter-menu-button:hover {
    color: #3b82f6;
  }
  .p-tag {
    font-weight: 600;
    border-radius: 20px;
    padding: 0.25rem 0.75rem;
  }
  .p-tag-success {
    background: #dcfce7;
    color: #15803d;
  }
  .p-tag-info {
    background: #dbeafe;
    color: #1e40af;
  }
  .p-tag-danger {
    background: #fee2e2;
    color: #b91c1c;
  }
`;

const Appointment = () => {
    const [view, setView] = useState("table");
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<string>('Today');
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const user = useSelector((state: any) => state.user);
    const matches = useMediaQuery('(max-width: 768px)');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        doctorName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        reason: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        notes: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        status: { value: null, matchMode: FilterMatchMode.IN },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const getSeverity = (status: string) => {
        switch (status) {
            case 'CANCELLED': return 'danger';
            case 'COMPLETED': return 'success';
            case 'SCHEDULED': return 'info';
            default: return null;
        }
    };

    useEffect(() => {
        fetchData();
        getDoctorDropdown()
            .then((data) => {
                setDoctors(data.map((doctor: any) => ({
                    value: "" + doctor.id,
                    label: doctor.name
                })));
            })
            .catch((error) => console.error("Error fetching doctors:", error));
    }, []);

    const fetchData = () => {
        setInitialLoading(true);
        getAppointmentsByPatient(user.profileId)
            .then((data) => {
                setAppointments(getCustomers(data));
            })
            .catch((error) => console.error("Error fetching appointments:", error))
            .finally(() => setInitialLoading(false));
    };

    const getCustomers = (data: any[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters: any = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const form = useForm({
        initialValues: {
            doctorId: '',
            patientId: user.profileId,
            appointmentTime: new Date(),
            reason: '',
            notes: ""
        },
        validate: {
            doctorId: (value) => !value ? 'Doctor is required' : undefined,
            appointmentTime: (value) => !value ? 'Appointment time is required' : undefined,
            reason: (value) => !value ? 'Reason for appointment is required' : undefined,
        },
    });

    const statusBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const handleDelete = (rowData: any) => {
        modals.openConfirmModal({
            title: <span className='text-xl font-serif font-semibold'>Are you sure?</span>,
            centered: true,
            children: (
                <Text size="sm">
                    You want to cancel this appointment? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => {
                cancelAppointment(rowData.id)
                    .then(() => {
                        successNotification("Appointment cancelled successfully");
                        setAppointments(appointments.map((appointment) =>
                            appointment.id === rowData.id ? { ...appointment, status: "CANCELLED" } : appointment
                        ));
                    })
                    .catch((error) => {
                        errorNotification(error.response?.data?.errorMessage || "Failed to cancel appointment");
                    });
            },
        });
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div className='flex gap-2'>
                <ActionIcon color='red' onClick={() => handleDelete(rowData)} variant="light" radius="xl">
                    <IconTrash size={18} stroke={1.5} />
                </ActionIcon>
            </div>
        );
    };

    const timeTemplate = (rowData: any) => {
        return <span className="text-sm font-medium text-gray-700">{formatDateWithTime(rowData.appointmentTime)}</span>;
    };

    const leftToolbarTemplate = () => {
        return (
            <Button
                leftSection={<IconPlus size={18} />}
                size={matches ? "xs" : "md"}
                onClick={open}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
                radius="xl"
                className="shadow-md hover:shadow-lg transition-shadow"
            >
                Schedule
            </Button>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className='md:flex hidden gap-3 items-center'>
                <SegmentedControl
                    value={view}
                    size={matches ? "xs" : "md"}
                    color='blue'
                    onChange={setView}
                    data={[
                        { label: <IconTable size={16} />, value: 'table' },
                        { label: <IconLayoutGrid size={16} />, value: 'card' }
                    ]}
                    radius="xl"
                    className="bg-gray-100 p-1"
                />
                <TextInput
                    className='lg:block hidden'
                    leftSection={<IconSearch size={16} />}
                    fw={500}
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Search"
                    radius="xl"
                    size="sm"
                />
            </div>
        );
    };

    const centerToolbarTemplate = () => {
        return (
            <SegmentedControl
                value={tab}
                size={matches ? "xs" : "md"}
                variant="filled"
                onChange={setTab}
                data={["Today", "Upcoming", "Past"]}
                radius="xl"
                className="bg-gray-100 p-1"
                color={
                    tab === "Today" ? "blue" : tab === "Upcoming" ? "green" : "red"
                }
            />
        );
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentDay = new Date(appointmentDate);
        appointmentDay.setHours(0, 0, 0, 0);
        if (tab === "Today") return appointmentDay.getTime() === today.getTime();
        if (tab === "Upcoming") return appointmentDay.getTime() > today.getTime();
        if (tab === "Past") return appointmentDay.getTime() < today.getTime();
        return true;
    });

    const handleSubmit = (values: any) => {
        setLoading(true);
        scheduleAppointment(values)
            .then(() => {
                close();
                form.reset();
                fetchData();
                successNotification("Appointment scheduled successfully");
            })
            .catch((error) => {
                errorNotification(error.response?.data?.errorMessage || "Failed to schedule appointment");
            })
            .finally(() => setLoading(false));
    };

    // Loading skeleton
    if (initialLoading) {
        return (
            <>
                <style>{customPrimeStyles}</style>
                <div className="appointment-container">
                    <div className="appointment-header">
                        <div className="flex flex-col">
                            <span className="appointment-eyebrow">Appointments</span>
                            <h2 className="appointment-title">Manage Appointments</h2>
                        </div>
                        <div className="appointment-badge">
                            <Skeleton height={32} width={80} radius="xl" />
                        </div>
                    </div>
                    <div className="appointment-rule" />
                    <div className="appointment-toolbar-skeleton">
                        <Skeleton height={40} radius="xl" />
                    </div>
                    <div className="grid gap-4 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} height={70} radius="lg" />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{customPrimeStyles}</style>
            <div className="appointment-container">
                <div className="appointment-header">
                    <div className="flex flex-col">
                        <span className="appointment-eyebrow">Appointments</span>
                        <h2 className="appointment-title">Manage Appointments</h2>
                    </div>
                    <div className="appointment-badge">
                        <Badge size="lg" variant="filled" color="blue" radius="xl">
                            {filteredAppointments.length} total
                        </Badge>
                    </div>
                </div>

                <div className="appointment-rule" />

                <Toolbar
                    className="appointment-toolbar"
                    start={leftToolbarTemplate}
                    center={centerToolbarTemplate}
                    end={rightToolbarTemplate}
                />

                <div className="mt-4">
                    {view === "table" && !matches ? (
                        <DataTable
                            value={filteredAppointments}
                            stripedRows
                            size="small"
                            paginator
                            rows={10}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            rowsPerPageOptions={[10, 25, 50]}
                            dataKey="id"
                            filters={filters}
                            filterDisplay="menu"
                            globalFilterFields={['doctorName', 'reason', 'notes', 'status']}
                            emptyMessage="No appointment found."
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            className="p-datatable-modern"
                        >
                            <Column field="doctorName" header="Doctor" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }} />
                            <Column field="appointmentTime" header="Date & Time" sortable style={{ minWidth: '14rem' }} body={timeTemplate} />
                            <Column field="reason" header="Reason" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }} />
                            <Column field="notes" header="Notes" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }} />
                            <Column field="status" header="Status" sortable filterMenuStyle={{ width: '12rem' }} style={{ minWidth: '10rem' }} body={statusBodyTemplate} />
                            <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} body={actionBodyTemplate} />
                        </DataTable>
                    ) : (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((appointment) => (
                                    <ApCard key={appointment.id} {...appointment} />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-12">
                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-300 mb-4 animate-spin" />
                                    <p className="text-gray-500 text-sm font-medium">No appointments found</p>
                                    <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Modal
                    opened={opened}
                    size="lg"
                    onClose={close}
                    title={
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Schedule Appointment
                        </div>
                    }
                    centered
                    radius="lg"
                    padding="xl"
                    overlayProps={{ blur: 3, opacity: 0.5 }}
                >
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-5">
                        <Select
                            {...form.getInputProps("doctorId")}
                            withAsterisk
                            data={doctors}
                            label="Doctor"
                            placeholder="Select doctor"
                            radius="md"
                            size="md"
                        />
                        <DateTimePicker
                            {...form.getInputProps("appointmentTime")}
                            withAsterisk
                            label="Appointment Time"
                            placeholder="Pick date and time"
                            radius="md"
                            size="md"
                            minDate={new Date()}
                        />
                        <Select
                            {...form.getInputProps("reason")}
                            data={appointmentReasons}
                            withAsterisk
                            label="Reason for Appointment"
                            placeholder="Select reason"
                            radius="md"
                            size="md"
                        />
                        <Textarea
                            {...form.getInputProps("notes")}
                            label="Additional Notes"
                            placeholder="Enter any additional notes"
                            radius="md"
                            size="md"
                            autosize
                            minRows={3}
                        />
                        <Button type="submit" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 135 }} fullWidth radius="xl" size="md">
                            Submit
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
    );
};

// Add container and toolbar styles
const style = document.createElement('style');
style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.appointment-container {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 28px;
    padding: 28px 28px 24px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02);
    border: 1px solid #eef2ff;
    transition: all 0.2s ease;
}

.appointment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
}

.appointment-eyebrow {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #3b82f6;
}

.appointment-title {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.appointment-badge {
    background: #eff6ff;
    border-radius: 40px;
    padding: 6px 16px;
}

.appointment-rule {
    height: 2px;
    background: linear-gradient(90deg, #e2e8f0, #3b82f6, #e2e8f0);
    margin-bottom: 24px;
    opacity: 0.6;
}

.appointment-toolbar {
    background: #f8fafc;
    border-radius: 40px;
    padding: 8px 16px;
    margin-bottom: 20px;
    border: 1px solid #e2e8f0;
}

.appointment-toolbar-skeleton {
    margin-bottom: 20px;
}
`;
document.head.appendChild(style);

export default Appointment;