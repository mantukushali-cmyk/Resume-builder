import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		const [year, month] = dateStr.split("-");
		return new Date(year, month - 1).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short"
		});
	};

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			
			{/* Header */}
			<header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
				<h1 className="text-4xl font-light mb-3">
					{data.personal_info?.full_name || "Your Name"}
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
					{data.personal_info?.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							<span>{data.personal_info.email}</span>
						</div>
					)}
					{data.personal_info?.phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4" />
							<span>{data.personal_info.phone}</span>
						</div>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a target="_blank" href={data.personal_info.linkedin} className="flex items-center gap-2">
							<Linkedin className="size-4" />
							<span className="text-xs break-all">
								{data.personal_info.linkedin}
							</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a target="_blank" href={data.personal_info.website} className="flex items-center gap-2">
							<Globe className="size-4" />
							<span className="text-xs break-all">
								{data.personal_info.website}
							</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8">

				{/* Summary */}
				{data.professional_summary && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 border-b">Professional Summary</h2>
						<p>{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience?.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 border-b">Experience</h2>

						{data.experience.map((exp, i) => (
							<div key={i} className="mb-5 border-l pl-4">
								<h3 className="font-semibold">{exp.position}</h3>
								<p style={{ color: accentColor }}>{exp.company}</p>
								<p className="text-sm text-gray-500">
									{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
								</p>
								<p className="text-sm mt-2">{exp.description}</p>
							</div>
						))}
					</section>
				)}

				{/* Projects */}
				{data.projects?.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 border-b">Projects</h2>

						{data.projects.map((p, i) => (
							<div key={i} className="mb-4">
								<h3 className="font-semibold">{p.name}</h3>
								<p className="text-sm">{p.description}</p>
							</div>
						))}
					</section>
				)}

				{/* ===== FIXED ORDER START ===== */}

				{/* Skills */}
				{data.skills?.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 border-b">Skills</h2>
						<div className="flex flex-wrap gap-2">
							{data.skills.map((skill, i) => (
								<span key={i} className="px-3 py-1 text-white rounded" style={{ background: accentColor }}>
									{skill}
								</span>
							))}
						</div>
					</section>
				)}

				{/* Languages */}
				{data.languages?.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 border-b">Languages</h2>
						{data.languages.map((lang, i) => (
							<p key={i}>{lang.name} — {lang.level}</p>
						))}
					</section>
				)}

				{/* Achievements */}
				{data.achievements?.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 border-b">Achievements</h2>

						{data.achievements.map((a, i) => (
							<div key={i} className="mb-4">
								<h3 className="font-semibold">{a.title}</h3>
								<p className="text-sm">{a.issuer} • {a.date}</p>
								<p className="text-sm">{a.description}</p>
							</div>
						))}
					</section>
				)}

				{/* Education */}
				{data.education?.length > 0 && (
					<section>
						<h2 className="text-2xl font-light mb-4 border-b">Education</h2>

						{data.education.map((edu, i) => (
							<div key={i} className="mb-4">
								<h3>{edu.degree}</h3>
								<p style={{ color: accentColor }}>{edu.institution}</p>
								<p className="text-sm">{formatDate(edu.graduation_date)}</p>
							</div>
						))}
					</section>
				)}

				{/* ===== FIXED ORDER END ===== */}

			</div>
		</div>
	);
};

export default ModernTemplate;