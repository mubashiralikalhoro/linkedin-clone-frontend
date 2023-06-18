import React from "react";

const SkillsCard = ({ skills }) => {
  return (
    <div className="bg-slate-800 rounded-md w-full h-fit p-4 lg:px-8 md:px-6 px-4 mt-2 ">
      <h1 className="font-bold text-xl">Skills</h1>
      <div className="flex gap-2 flex-wrap mt-2">
        {[...skills].map((skill) => (
          <p className="text-sm p-2 bg-slate-700 rounded" key={skill.id}>
            {skill.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SkillsCard;
