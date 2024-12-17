import React from 'react';
import { Goal } from '../../types';
import { Edit, Trash2, Calendar } from 'lucide-react';

interface GoalListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map(goal => (
        <div
          key={goal.id}
          className="p-4 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg dark:text-white">{goal.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(goal)}
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(goal.id)}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {goal.description}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>

          {goal.deadline && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          )}

          {goal.milestones.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                Milestones
              </h4>
              <ul className="space-y-1">
                {goal.milestones.map((milestone, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {milestone}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GoalList;