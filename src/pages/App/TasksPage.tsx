import React from 'react';
import { useParams } from 'react-router-dom';
import { KanbanBoard } from '../../components/App/Tasks/KanbanBoard';
interface SubTask {
  _id: string;
  title: string;
}

interface ParentTask {
  _id: string;
  title: string;
}

interface Task {
  _id: string;
  title: string;
  parentTask: ParentTask | null;
  subTasks: SubTask[];
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'REVIEW';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  description: string;
}
const TasksPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const tasks: Task[] = [
    {
      _id: '670e54a629dce0738477cedc',
      title: 'ana sayfa  navbar ',
      parentTask: {
        _id: '670e547f29dce0738477ceda',
        title: 'ana sayfa  ',
      },
      subTasks: [],
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: '1729198800000',
      description: 'ana sayfada navbar  tasarımı',
    },
    {
      _id: '670e5723e7756e170c55c35c',
      title: 'user  servis yapısının geliştirlmesi',
      parentTask: null,
      subTasks: [],
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '1729803600000',
      description: 'user  servis yapısının geliştirlmesi',
    },
    {
      _id: '6710c4f45014ab301a9dbbf1',
      title: 'user  servis yapısının geliştirlmesi',
      parentTask: null,
      subTasks: [],
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '1729803600000',
      description: 'user  servis yapısının geliştirlmesi',
    },
    {
      _id: '6710f5fdba7e503c0efc4f45',
      title: 'chat page design',
      parentTask: null,
      subTasks: [
        {
          _id: '671254c8b2298cd9aab79ae6',
          title: 'chat page input design ',
        },
        {
          _id: '67125d0cb2298cd9aab79b3e',
          title: 'chat page buton desing  ',
        },
        {
          _id: '67125dc9b2298cd9aab79b56',
          title: 'chat page icon desing  ',
        },
      ],
      status: 'REVIEW',
      priority: 'MEDIUM',
      dueDate: '1729803600000',
      description: 'chat sayfasının teme  tasırımı ',
    },
    {
      _id: '671254c8b2298cd9aab79ae6',
      title: 'chat page input design ',
      parentTask: {
        _id: '6710f5fdba7e503c0efc4f45',
        title: 'chat page design',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729717200000',
      description: 'chat  için messaja giriş  input  tasarımının yapılması ',
    },
    {
      _id: '671258fcb2298cd9aab79b12',
      title: 'vide call  page  design ',
      parentTask: null,
      subTasks: [
        {
          _id: '67125e0fb2298cd9aab79b64',
          title: 'video cal  icon desing  ',
        },
      ],
      status: 'TODO',
      priority: 'HIGH',
      dueDate: '1729890000000',
      description: 'görüntülü arama için sayfa tasarımı',
    },
    {
      _id: '67125b74b2298cd9aab79b26',
      title: 'vana sayfa footer  yazı tipleri ',
      parentTask: {
        _id: '670e545a29dce0738477ced6',
        title: 'ana sayfa  footer tasarımı',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '67125d0cb2298cd9aab79b3e',
      title: 'chat page buton desing  ',
      parentTask: {
        _id: '6710f5fdba7e503c0efc4f45',
        title: 'chat page design',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '67125dc9b2298cd9aab79b56',
      title: 'chat page icon desing  ',
      parentTask: {
        _id: '6710f5fdba7e503c0efc4f45',
        title: 'chat page design',
      },
      subTasks: [
        {
          _id: '671263e7b2298cd9aab79bc4',
          title: 'chat page  cal icon text  colar   desing  ',
        },
        {
          _id: '671263f2b2298cd9aab79bda',
          title: 'chat page  cal icon   colar   desing  ',
        },
      ],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '67125e0fb2298cd9aab79b64',
      title: 'video cal  icon desing  ',
      parentTask: {
        _id: '671258fcb2298cd9aab79b12',
        title: 'vide call  page  design ',
      },
      subTasks: [
        {
          _id: '67126397b2298cd9aab79ba9',
          title: 'video cal icon colar   desing  ',
        },
        {
          _id: '671263bdb2298cd9aab79bb5',
          title: 'video cal icon text  colar   desing  ',
        },
      ],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '67126312b2298cd9aab79b8a',
      title: 'task  page  desing  ',
      parentTask: null,
      subTasks: [
        {
          _id: '6712632fb2298cd9aab79b90',
          title: 'task  page  buton  desing  ',
        },
        {
          _id: '6712633cb2298cd9aab79b9b',
          title: 'task  page   footer  desing  ',
        },
      ],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '6712632fb2298cd9aab79b90',
      title: 'task  page  buton  desing  ',
      parentTask: {
        _id: '67126312b2298cd9aab79b8a',
        title: 'task  page  desing  ',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '6712633cb2298cd9aab79b9b',
      title: 'task  page   footer  desing  ',
      parentTask: {
        _id: '67126312b2298cd9aab79b8a',
        title: 'task  page  desing  ',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '67126397b2298cd9aab79ba9',
      title: 'video cal icon colar   desing  ',
      parentTask: {
        _id: '67125e0fb2298cd9aab79b64',
        title: 'video cal  icon desing  ',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '671263bdb2298cd9aab79bb5',
      title: 'video cal icon text  colar   desing  ',
      parentTask: {
        _id: '67125e0fb2298cd9aab79b64',
        title: 'video cal  icon desing  ',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '671263e7b2298cd9aab79bc4',
      title: 'chat page  cal icon text  colar   desing  ',
      parentTask: {
        _id: '67125dc9b2298cd9aab79b56',
        title: 'chat page icon desing  ',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
    {
      _id: '671263f2b2298cd9aab79bda',
      title: 'chat page  cal icon   colar   desing  ',
      parentTask: {
        _id: '67125dc9b2298cd9aab79b56',
        title: 'chat page icon desing  ',
      },
      subTasks: [],
      status: 'TODO',
      priority: 'LOW',
      dueDate: '1729890000000',
      description: 'yazı tiplerini belirleme',
    },
  ];
  return (
    <div>
      <KanbanBoard initialTasks={tasks} />
    </div>
  );
};

export default TasksPage;
